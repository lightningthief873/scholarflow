#[allow(unused_use)]
module scholarflow::grant_system {
    use std::string::{Self, String};
    use iota::coin::{Coin, split, balance};
    use iota::iota::IOTA;
    use iota::event;
    use iota::clock::{Clock};

    // ================ STRUCTS ================

    // Student profile with verification status
    public struct StudentProfile has key, store {
        id: UID,
        student_address: address,
        name: String,
        age: u64,
        demographic: String, // e.g., "minority", "rural", "low-income"
        education_level: String, // e.g., "high-school", "undergraduate", "graduate"
        documents_verified: bool,
        verification_timestamp: u64,
        total_grants_received: u64,
    }

    // Grant structure
    public struct Grant has key, store {
        id: UID,
        grant_owner: address,
        title: String,
        description: String,
        total_funding: u64,
        remaining_funding: u64,
        target_demographic: String,
        target_education_level: String,
        max_grant_per_student: u64,
        application_deadline: u64,
        is_active: bool,
        approved_students: vector<address>,
    }

    // Grant application
    public struct GrantApplication has key, store {
        id: UID,
        grant_id: ID,
        student_address: address,
        application_text: String,
        requested_amount: u64,
        application_timestamp: u64,
        status: String, // "pending", "approved", "rejected"
    }

    // Student fund wallet (holds approved grant money)
    public struct StudentWallet has key, store {
        id: UID,
        student_address: address,
        available_balance: u64,
        total_received: u64,
        spending_history: vector<SpendingRecord>,
    }

    // Spending record for transparency
    public struct SpendingRecord has store, copy, drop {
        amount: u64,
        merchant_address: address,
        merchant_type: String,
        item_description: String,
        timestamp: u64,
    }

    // Educational marketplace store
    public struct EducationalStore has key, store {
        id: UID,
        owner: address,
        name: String,
        store_type: String, // "university", "bookstore", "online_course", "equipment"
        is_verified_educational: bool,
        items: vector<StoreItem>,
    }

    // Regular marketplace store (for normal users, not accessible with grant funds)
    public struct RegularStore has key, store {
        id: UID,
        owner: address,
        name: String,
        store_type: String, // "electronics", "clothing", "food", "entertainment"
        items: vector<StoreItem>,
    }

    // Store item
    public struct StoreItem has store, copy, drop {
        item_id: u64,
        name: String,
        description: String,
        price: u64,
        category: String, // "books", "tuition", "equipment", "courses"
        is_available: bool,
    }

    // Purchase transaction record
    public struct Purchase has key, store {
        id: UID,
        student_address: address,
        store_address: address,
        item_id: u64,
        amount_paid: u64,
        timestamp: u64,
    }

    // Admin capabilities
    public struct AdminCap has key {
        id: UID,
    }

    // System registry to track all components
    public struct SystemRegistry has key {
        id: UID,
        total_students: u64,
        total_grants: u64,
        total_stores: u64,
        total_funding_distributed: u64,
    }

    // ================ EVENTS ================

    public struct StudentRegistered has copy, drop {
        student_address: address,
        name: String,
        demographic: String,
        message: String,
    }

    public struct GrantCreated has copy, drop {
        grant_id: ID,
        owner: address,
        title: String,
        total_funding: u64,
        target_demographic: String,
    }

    public struct GrantApplicationSubmitted has copy, drop {
        grant_id: ID,
        student_address: address,
        requested_amount: u64,
        message: String,
    }

    public struct GrantApproved has copy, drop {
        grant_id: ID,
        student_address: address,
        approved_amount: u64,
        message: String,
    }

    public struct EducationalPurchase has copy, drop {
        student_address: address,
        store_address: address,
        item_name: String,
        amount: u64,
        message: String,
    }

    // ================ ERROR CODES ================

    #[error]
    const STUDENT_ALREADY_REGISTERED: vector<u8> = b"Student already registered";
    #[error]
    const STUDENT_NOT_REGISTERED: vector<u8> = b"Student not registered";
    #[error]
    const DOCUMENTS_NOT_VERIFIED: vector<u8> = b"Student documents not verified";
    #[error]
    const GRANT_NOT_ACTIVE: vector<u8> = b"Grant is not active";
    #[error]
    const APPLICATION_DEADLINE_PASSED: vector<u8> = b"Application deadline has passed";
    #[error]
    const INSUFFICIENT_GRANT_FUNDING: vector<u8> = b"Insufficient funding in grant";
    #[error]
    const DEMOGRAPHIC_MISMATCH: vector<u8> = b"Student demographic doesn't match grant requirements";
    #[error]
    const EDUCATION_LEVEL_MISMATCH: vector<u8> = b"Student education level doesn't match grant requirements";
    #[error]
    const INSUFFICIENT_STUDENT_BALANCE: vector<u8> = b"Insufficient balance in student wallet";
    #[error]
    const STORE_NOT_EDUCATIONAL: vector<u8> = b"Store is not verified as educational";
    #[error]
    const ITEM_NOT_AVAILABLE: vector<u8> = b"Item is not available";
    #[error]
    const ALREADY_APPLIED: vector<u8> = b"Student already applied to this grant";
    #[error]
    const APPLICATION_NOT_FOUND: vector<u8> = b"Grant application not found";
    #[error]
    const CANNOT_USE_GRANT_FUNDS: vector<u8> = b"Cannot use grant funds at regular stores";
    #[error]
    const UNAUTHORIZED: vector<u8> = b"Unauthorized access";
    #[error]
    const INSUFFICIENT_PERSONAL_FUNDS: vector<u8> = b"Insufficient personal funds for purchase";

    public struct RegularPurchase has copy, drop {
        buyer_address: address,
        store_address: address,
        item_name: String,
        amount: u64,
        payment_method: String, // "personal_funds" or "grant_funds"
        message: String,
    }

    // ================ INITIALIZATION ================

    fun init(ctx: &mut TxContext) {
        let sender = ctx.sender();
        
        // Create admin capability
        transfer::transfer(AdminCap {
            id: object::new(ctx)
        }, sender);

        // Create system registry
        transfer::share_object(SystemRegistry {
            id: object::new(ctx),
            total_students: 0,
            total_grants: 0,
            total_stores: 0,
            total_funding_distributed: 0,
        });
    }

    // ================ STUDENT FUNCTIONS ================

    // Register as a student
    #[allow(lint(self_transfer))]
    public fun register_student(
        name: String,
        age: u64,
        demographic: String,
        education_level: String,
        registry: &mut SystemRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();
        
        let student_profile = StudentProfile {
            id: object::new(ctx),
            student_address: sender,
            name: name,
            age,
            demographic: demographic,
            education_level,
            documents_verified: false,
            verification_timestamp: current_time,
            total_grants_received: 0,
        };

        // Create student wallet
        let student_wallet = StudentWallet {
            id: object::new(ctx),
            student_address: sender,
            available_balance: 0,
            total_received: 0,
            spending_history: vector::empty<SpendingRecord>(),
        };

        registry.total_students = registry.total_students + 1;

        event::emit(StudentRegistered {
            student_address: sender,
            name: student_profile.name,
            demographic: student_profile.demographic,
            message: string::utf8(b"Student registered successfully"),
        });

        transfer::transfer(student_profile, sender);
        transfer::transfer(student_wallet, sender);
    }

    // Verify student documents (simplified for hackathon)
    public fun verify_documents(
        student_profile: &mut StudentProfile,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(student_profile.student_address == sender, UNAUTHORIZED);
        
        student_profile.documents_verified = true;
        student_profile.verification_timestamp = clock.timestamp_ms();
    }

    // ================ GRANT FUNCTIONS ================

    // Create a new grant
    #[allow(lint(self_transfer))]
    public fun create_grant(
        title: String,
        description: String,
        funding_coin: Coin<IOTA>,
        target_demographic: String,
        target_education_level: String,
        max_grant_per_student: u64,
        application_deadline: u64,
        registry: &mut SystemRegistry,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let funding_amount = funding_coin.value();
        
        let grant = Grant {
            id: object::new(ctx),
            grant_owner: sender,
            title: title,
            description: description,
            total_funding: funding_amount,
            remaining_funding: funding_amount,
            target_demographic: target_demographic,
            target_education_level,
            max_grant_per_student,
            application_deadline,
            is_active: true,
            approved_students: vector::empty<address>(),
        };

        let grant_id = object::id(&grant);
        registry.total_grants = registry.total_grants + 1;

        event::emit(GrantCreated {
            grant_id,
            owner: sender,
            title: grant.title,
            total_funding: funding_amount,
            target_demographic: grant.target_demographic,
        });

        // Store the funding coin with the grant (in a real implementation, you'd handle this differently)
        transfer::public_transfer(funding_coin, sender);
        transfer::share_object(grant);
    }

    // Apply for a grant
    public fun apply_for_grant(
        student_profile: &StudentProfile,
        grant: &Grant,
        application_text: String,
        requested_amount: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();
        
        // Verification checks
        assert!(student_profile.student_address == sender, UNAUTHORIZED);
        assert!(student_profile.documents_verified, DOCUMENTS_NOT_VERIFIED);
        assert!(grant.is_active, GRANT_NOT_ACTIVE);
        assert!(current_time <= grant.application_deadline, APPLICATION_DEADLINE_PASSED);
        assert!(student_profile.demographic == grant.target_demographic, DEMOGRAPHIC_MISMATCH);
        assert!(student_profile.education_level == grant.target_education_level, EDUCATION_LEVEL_MISMATCH);
        assert!(requested_amount <= grant.max_grant_per_student, INSUFFICIENT_GRANT_FUNDING);

        let grant_id = object::id(grant);
        
        let application = GrantApplication {
            id: object::new(ctx),
            grant_id,
            student_address: sender,
            application_text,
            requested_amount,
            application_timestamp: current_time,
            status: string::utf8(b"pending"),
        };

        event::emit(GrantApplicationSubmitted {
            grant_id,
            student_address: sender,
            requested_amount,
            message: string::utf8(b"Grant application submitted successfully"),
        });

        transfer::share_object(application);
    }

    // Approve a grant application (by grant owner)
    public fun approve_grant_application(
        grant: &mut Grant,
        application: &mut GrantApplication,
        student_wallet: &mut StudentWallet,
        approved_amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        assert!(grant.grant_owner == sender, UNAUTHORIZED);
        assert!(application.status == string::utf8(b"pending"), APPLICATION_NOT_FOUND);
        assert!(grant.remaining_funding >= approved_amount, INSUFFICIENT_GRANT_FUNDING);
        assert!(approved_amount <= grant.max_grant_per_student, INSUFFICIENT_GRANT_FUNDING);

        // Update application status
        application.status = string::utf8(b"approved");
        
        // Update grant funding
        grant.remaining_funding = grant.remaining_funding - approved_amount;
        vector::push_back(&mut grant.approved_students, application.student_address);

        // Add funds to student wallet
        student_wallet.available_balance = student_wallet.available_balance + approved_amount;
        student_wallet.total_received = student_wallet.total_received + approved_amount;

        event::emit(GrantApproved {
            grant_id: application.grant_id,
            student_address: application.student_address,
            approved_amount,
            message: string::utf8(b"Grant approved and funds transferred"),
        });
    }

    // ================ MARKETPLACE FUNCTIONS ================

    // Register as an educational store
    public fun register_educational_store(
        name: String,
        store_type: String,
        registry: &mut SystemRegistry,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        let store = EducationalStore {
            id: object::new(ctx),
            owner: sender,
            name,
            store_type,
            is_verified_educational: true, // Auto-verified for hackathon
            items: vector::empty<StoreItem>(),
        };

        registry.total_stores = registry.total_stores + 1;
        transfer::share_object(store);
    }

    // Register as a regular marketplace store (cannot accept grant funds)
    public fun register_regular_store(
        name: String,
        store_type: String,
        registry: &mut SystemRegistry,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        
        let store = RegularStore {
            id: object::new(ctx),
            owner: sender,
            name,
            store_type,
            items: vector::empty<StoreItem>(),
        };

        registry.total_stores = registry.total_stores + 1;
        transfer::share_object(store);
    }

    // Add item to educational store
    public fun add_educational_item(
        store: &mut EducationalStore,
        item_id: u64,
        name: String,
        description: String,
        price: u64,
        category: String,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(store.owner == sender, UNAUTHORIZED);

        let item = StoreItem {
            item_id,
            name,
            description,
            price,
            category,
            is_available: true,
        };

        vector::push_back(&mut store.items, item);
    }

    // Add item to regular store
    public fun add_regular_item(
        store: &mut RegularStore,
        item_id: u64,
        name: String,
        description: String,
        price: u64,
        category: String,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        assert!(store.owner == sender, UNAUTHORIZED);

        let item = StoreItem {
            item_id,
            name,
            description,
            price,
            category,
            is_available: true,
        };

        vector::push_back(&mut store.items, item);
    }

    // Purchase from educational store using grant funds
    public fun purchase_educational_item(
        student_wallet: &mut StudentWallet,
        store: &mut EducationalStore,
        item_id: u64,
        registry: &mut SystemRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();
        
        assert!(student_wallet.student_address == sender, UNAUTHORIZED);
        assert!(store.is_verified_educational, STORE_NOT_EDUCATIONAL);

        // Find the item
        let mut i = 0;
        let items_length = vector::length(&store.items);
        let mut item_found = false;
        let mut item_price = 0;
        let mut item_name = string::utf8(b"");

        while (i < items_length) {
            let item = vector::borrow(&store.items, i);
            if (item.item_id == item_id && item.is_available) {
                item_found = true;
                item_price = item.price;
                item_name = item.name;
                break
            };
            i = i + 1;
        };

        assert!(item_found, ITEM_NOT_AVAILABLE);
        assert!(student_wallet.available_balance >= item_price, INSUFFICIENT_STUDENT_BALANCE);

        // Deduct from student wallet
        student_wallet.available_balance = student_wallet.available_balance - item_price;

        // Record spending
        let spending_record = SpendingRecord {
            amount: item_price,
            merchant_address: store.owner,
            merchant_type: store.store_type,
            item_description: item_name,
            timestamp: current_time,
        };
        vector::push_back(&mut student_wallet.spending_history, spending_record);

        // Create purchase record
        let purchase = Purchase {
            id: object::new(ctx),
            student_address: sender,
            store_address: store.owner,
            item_id,
            amount_paid: item_price,
            timestamp: current_time,
        };

        registry.total_funding_distributed = registry.total_funding_distributed + item_price;

        event::emit(EducationalPurchase {
            student_address: sender,
            store_address: store.owner,
            item_name,
            amount: item_price,
            message: string::utf8(b"Educational item purchased successfully"),
        });

        transfer::share_object(purchase);
    }

    // Purchase from regular store using personal funds (NOT grant funds)
    #[allow(unused_variable)]
    public fun purchase_regular_item_with_personal_funds(
        personal_funds: &mut Coin<IOTA>,
        store: &mut RegularStore,
        item_id: u64,
        registry: &mut SystemRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let current_time = clock.timestamp_ms();
        
        // Find the item
        let mut i = 0;
        let items_length = vector::length(&store.items);
        let mut item_found = false;
        let mut item_price = 0;
        let mut item_name = string::utf8(b"");

        while (i < items_length) {
            let item = vector::borrow(&store.items, i);
            if (item.item_id == item_id && item.is_available) {
                item_found = true;
                item_price = item.price;
                item_name = item.name;
                break
            };
            i = i + 1;
        };

        assert!(item_found, ITEM_NOT_AVAILABLE);
        assert!(personal_funds.value() >= item_price, INSUFFICIENT_PERSONAL_FUNDS);

        // Deduct from personal funds and transfer to store owner
        let payment = personal_funds.split(item_price, ctx);
        transfer::public_transfer(payment, store.owner);

        // Create purchase record
        let purchase = Purchase {
            id: object::new(ctx),
            student_address: sender,
            store_address: store.owner,
            item_id,
            amount_paid: item_price,
            timestamp: current_time,
        };

        event::emit(RegularPurchase {
            buyer_address: sender,
            store_address: store.owner,
            item_name,
            amount: item_price,
            payment_method: string::utf8(b"personal_funds"),
            message: string::utf8(b"Regular item purchased with personal funds"),
        });

        transfer::share_object(purchase);
    }

    // Attempt to purchase from regular store with grant funds (WILL FAIL)
    public fun purchase_regular_item_with_grant_funds(
        _student_wallet: &mut StudentWallet,
        _store: &mut RegularStore,
        _item_id: u64,
        _registry: &mut SystemRegistry,
        _clock: &Clock,
        _ctx: &mut TxContext
    ) {
        // This function will always fail to demonstrate the restriction
        assert!(false, CANNOT_USE_GRANT_FUNDS);
    }

    // ================ VIEW FUNCTIONS ================

    // Get student profile details
    public fun get_student_info(student_profile: &StudentProfile): (String, String, String, bool, u64) {
        (
            student_profile.name,
            student_profile.demographic,
            student_profile.education_level,
            student_profile.documents_verified,
            student_profile.total_grants_received
        )
    }

    // Get grant details
    public fun get_grant_info(grant: &Grant): (String, String, u64, u64, String, bool) {
        (
            grant.title,
            grant.description,
            grant.total_funding,
            grant.remaining_funding,
            grant.target_demographic,
            grant.is_active
        )
    }

    // Get student wallet balance
    public fun get_student_balance(student_wallet: &StudentWallet): (u64, u64) {
        (student_wallet.available_balance, student_wallet.total_received)
    }

    // ================ ADMIN FUNCTIONS ================

    // Deactivate a grant (admin only)
    public fun deactivate_grant(
        _: &AdminCap,
        grant: &mut Grant
    ) {
        grant.is_active = false;
    }

    // Get system statistics
    public fun get_system_stats(registry: &SystemRegistry): (u64, u64, u64, u64) {
        (
            registry.total_students,
            registry.total_grants,
            registry.total_stores,
            registry.total_funding_distributed
        )
    }

    // ================ TEST FUNCTIONS ================

    #[test_only]
    public fun test_init(ctx: &mut TxContext) {
        init(ctx);
    }
}
