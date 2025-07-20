#[test_only]
#[allow(unused_use)]
module scholarflow::grant_system_test;

use iota::clock::{Self, Clock};
use iota::coin;
use iota::iota::IOTA;
use iota::test_scenario::{Self, Scenario};
use scholarflow::grant_system::{
    AdminCap,
    SystemRegistry,
    StudentProfile,
    StudentWallet,
    Grant,
    GrantApplication,
    EducationalStore,
    RegularStore,
    Purchase,
    register_student,
    verify_documents,
    create_grant,
    apply_for_grant,
    approve_grant_application,
    register_educational_store,
    register_regular_store,
    add_educational_item,
    add_regular_item,
    purchase_educational_item,
    purchase_regular_item_with_personal_funds,
    get_student_info,
    get_grant_info,
    get_student_balance,
    get_system_stats,
    test_init
};
use std::string;

// Test addresses
const ADMIN: address = @0xADDD;
const STUDENT1: address = @0xADDF;
// const STUDENT2: address = @0xADDE;
const GRANT_OWNER: address = @0xFFFF;
const STORE_OWNER: address = @0xAFFF;
const REGULAR_STORE_OWNER: address = @0xFAFA;

#[test]
fun test_student_registration() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    test_scenario::next_tx(test, STUDENT1);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);
    let clock = clock::create_for_testing(test_scenario::ctx(test));

    register_student(
        string::utf8(b"Alice Smith"),
        20,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        &mut registry,
        &clock,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, STUDENT1);
    let student_profile = test_scenario::take_from_sender<StudentProfile>(test);
    let student_wallet = test_scenario::take_from_sender<StudentWallet>(test);

    // Verify student info
    let (name, demographic, education_level, verified, grants_received) = get_student_info(
        &student_profile,
    );
    assert!(name == string::utf8(b"Alice Smith"), 0);
    assert!(demographic == string::utf8(b"low-income"), 1);
    assert!(education_level == string::utf8(b"undergraduate"), 2);
    assert!(!verified, 3);
    assert!(grants_received == 0, 4);

    // Verify wallet balance
    let (available, total_received) = get_student_balance(&student_wallet);
    assert!(available == 0, 5);
    assert!(total_received == 0, 6);

    clock::destroy_for_testing(clock);
    test_scenario::return_to_sender(test, student_profile);
    test_scenario::return_to_sender(test, student_wallet);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

#[test]
fun test_document_verification() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    // Register student first
    test_scenario::next_tx(test, STUDENT1);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);
    let clock = clock::create_for_testing(test_scenario::ctx(test));

    register_student(
        string::utf8(b"Alice Smith"),
        20,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        &mut registry,
        &clock,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, STUDENT1);
    let mut student_profile = test_scenario::take_from_sender<StudentProfile>(test);

    // Verify documents
    verify_documents(&mut student_profile, &clock, test_scenario::ctx(test));

    // Check verification status
    let (_, _, _, verified, _) = get_student_info(&student_profile);
    assert!(verified, 0);

    clock::destroy_for_testing(clock);
    test_scenario::return_to_sender(test, student_profile);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

#[test]
fun test_grant_creation() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    test_scenario::next_tx(test, GRANT_OWNER);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);
    let funding_coin = coin::mint_for_testing<IOTA>(10000, test_scenario::ctx(test));

    create_grant(
        string::utf8(b"Education Support Grant"),
        string::utf8(b"Supporting low-income students"),
        funding_coin,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        2000, // max per student
        1735689600000, // future deadline
        &mut registry,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, GRANT_OWNER);
    let grant = test_scenario::take_shared<Grant>(test);

    // Verify grant info
    let (
        title,
        _description,
        total_funding,
        remaining_funding,
        target_demographic,
        is_active,
    ) = get_grant_info(&grant);
    assert!(title == string::utf8(b"Education Support Grant"), 0);
    assert!(total_funding == 10000, 1);
    assert!(remaining_funding == 10000, 2);
    assert!(target_demographic == string::utf8(b"low-income"), 3);
    assert!(is_active, 4);

    test_scenario::return_shared(grant);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

// #[test]
// fun test_grant_application_and_approval() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let test = &mut scenario;
//     initialize(test, ADMIN);

//     // Register student
//     test_scenario::next_tx(test, STUDENT1);
//     let mut registry = test_scenario::take_shared<SystemRegistry>(test);
//     let clock = clock::create_for_testing(test_scenario::ctx(test));

//     register_student(
//         string::utf8(b"Alice Smith"),
//         20,
//         string::utf8(b"low-income"),
//         string::utf8(b"undergraduate"),
//         &mut registry,
//         &clock,
//         test_scenario::ctx(test),
//     );

//     test_scenario::next_tx(test, STUDENT1);
//     let mut student_profile = test_scenario::take_from_sender<StudentProfile>(test);
//     verify_documents(&mut student_profile, &clock, test_scenario::ctx(test));

//     // Create grant
//     test_scenario::next_tx(test, GRANT_OWNER);
//     let funding_coin = coin::mint_for_testing<IOTA>(10000, test_scenario::ctx(test));

//     create_grant(
//         string::utf8(b"Education Support Grant"),
//         string::utf8(b"Supporting low-income students"),
//         funding_coin,
//         string::utf8(b"low-income"),
//         string::utf8(b"undergraduate"),
//         2000,
//         1735689600000, // future deadline
//         &mut registry,
//         test_scenario::ctx(test),
//     );

//     // Apply for grant
//     test_scenario::next_tx(test, STUDENT1);
//     let grant = test_scenario::take_shared<Grant>(test);

//     apply_for_grant(
//         &student_profile,
//         &grant,
//         string::utf8(b"I need funding for my education expenses"),
//         1500,
//         &clock,
//         test_scenario::ctx(test),
//     );

//     // Return it after use
//     test_scenario::return_shared(grant);

//     // Approve application
//     test_scenario::next_tx(test, GRANT_OWNER);
//     let mut grant_mut = test_scenario::take_shared<Grant>(test);
//     let mut application = test_scenario::take_shared<GrantApplication>(test);
//     let mut student_wallet = test_scenario::take_from_sender<StudentWallet>(test);

//     approve_grant_application(
//         &mut grant_mut,
//         &mut application,
//         &mut student_wallet,
//         1500,
//         test_scenario::ctx(test),
//     );

//     // Verify wallet balance after approval
//     let (available, total_received) = get_student_balance(&student_wallet);
//     assert!(available == 1500, 0);
//     assert!(total_received == 1500, 1);

//     test_scenario::return_to_sender(test, student_wallet);
//     test_scenario::return_to_sender(test, student_profile);
//     test_scenario::return_shared(application);
//     test_scenario::return_shared(grant_mut);
//     test_scenario::return_shared(registry);
//     clock::destroy_for_testing(clock);
//     test_scenario::end(scenario);
// }

#[test]
fun test_educational_store_registration() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    test_scenario::next_tx(test, STORE_OWNER);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);

    register_educational_store(
        string::utf8(b"University Bookstore"),
        string::utf8(b"bookstore"),
        &mut registry,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, STORE_OWNER);
    let mut store = test_scenario::take_shared<EducationalStore>(test);

    // Add item to store
    add_educational_item(
        &mut store,
        1,
        string::utf8(b"Physics Textbook"),
        string::utf8(b"Advanced Physics textbook for undergraduates"),
        300,
        string::utf8(b"books"),
        test_scenario::ctx(test),
    );

    test_scenario::return_shared(store);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

// #[test]
// fun test_educational_purchase() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let test = &mut scenario;
//     initialize(test, ADMIN);

//     // Set up student with grant funds
//     setup_student_with_funds(test);

//     // Set up educational store
//     test_scenario::next_tx(test, STORE_OWNER);
//     let mut registry = test_scenario::take_shared<SystemRegistry>(test);

//     register_educational_store(
//         string::utf8(b"University Bookstore"),
//         string::utf8(b"bookstore"),
//         &mut registry,
//         test_scenario::ctx(test),
//     );

//     test_scenario::next_tx(test, STORE_OWNER);
//     let mut store = test_scenario::take_shared<EducationalStore>(test);

//     add_educational_item(
//         &mut store,
//         1,
//         string::utf8(b"Physics Textbook"),
//         string::utf8(b"Advanced Physics textbook"),
//         300,
//         string::utf8(b"books"),
//         test_scenario::ctx(test),
//     );

//     // Purchase item
//     test_scenario::next_tx(test, STUDENT1);
//     let mut student_wallet = test_scenario::take_from_sender<StudentWallet>(test);
//     let clock = clock::create_for_testing(test_scenario::ctx(test));

//     purchase_educational_item(
//         &mut student_wallet,
//         &mut store,
//         1, // item_id
//         &mut registry,
//         &clock,
//         test_scenario::ctx(test),
//     );

//     // Verify wallet balance decreased
//     let (available, _) = get_student_balance(&student_wallet);
//     assert!(available == 1200, 0); // 1500 - 300 = 1200

//     clock::destroy_for_testing(clock);
//     test_scenario::return_to_sender(test, student_wallet);
//     test_scenario::return_shared(store);
//     test_scenario::return_shared(registry);
//     test_scenario::end(scenario);
// }

#[test]
fun test_regular_store_purchase_with_personal_funds() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    // Set up regular store
    test_scenario::next_tx(test, REGULAR_STORE_OWNER);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);

    register_regular_store(
        string::utf8(b"Electronics Store"),
        string::utf8(b"electronics"),
        &mut registry,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, REGULAR_STORE_OWNER);
    let mut store = test_scenario::take_shared<RegularStore>(test);

    add_regular_item(
        &mut store,
        1,
        string::utf8(b"Laptop"),
        string::utf8(b"Gaming laptop"),
        1000,
        string::utf8(b"electronics"),
        test_scenario::ctx(test),
    );

    // Purchase with personal funds
    test_scenario::next_tx(test, STUDENT1);
    let mut personal_coin = coin::mint_for_testing<IOTA>(1200, test_scenario::ctx(test));
    let clock = clock::create_for_testing(test_scenario::ctx(test));

    purchase_regular_item_with_personal_funds(
        &mut personal_coin,
        &mut store,
        1, // item_id
        &mut registry,
        &clock,
        test_scenario::ctx(test),
    );

    // Verify remaining personal funds
    assert!(personal_coin.value() == 200, 0); // 1200 - 1000 = 200

    personal_coin.burn_for_testing();
    clock::destroy_for_testing(clock);
    test_scenario::return_shared(store);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

#[test]
fun test_system_statistics() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    test_scenario::next_tx(test, ADMIN);
    let registry = test_scenario::take_shared<SystemRegistry>(test);

    // Check initial stats
    let (students, grants, stores, funding_distributed) = get_system_stats(&registry);
    assert!(students == 0, 0);
    assert!(grants == 0, 1);
    assert!(stores == 0, 2);
    assert!(funding_distributed == 0, 3);

    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = scholarflow::grant_system::DOCUMENTS_NOT_VERIFIED)]
fun test_apply_for_grant_without_verification() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    // Register student without verifying documents
    test_scenario::next_tx(test, STUDENT1);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);
    let clock = clock::create_for_testing(test_scenario::ctx(test));

    register_student(
        string::utf8(b"Alice Smith"),
        20,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        &mut registry,
        &clock,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, STUDENT1);
    let student_profile = test_scenario::take_from_sender<StudentProfile>(test);

    // Create grant
    test_scenario::next_tx(test, GRANT_OWNER);
    let funding_coin = coin::mint_for_testing<IOTA>(10000, test_scenario::ctx(test));

    create_grant(
        string::utf8(b"Education Support Grant"),
        string::utf8(b"Supporting low-income students"),
        funding_coin,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        2000,
        1735689600000,
        &mut registry,
        test_scenario::ctx(test),
    );

    // Try to apply without verification (should fail)
    test_scenario::next_tx(test, STUDENT1);
    let grant = test_scenario::take_shared<Grant>(test);

    apply_for_grant(
        &student_profile,
        &grant,
        string::utf8(b"I need funding"),
        1500,
        &clock,
        test_scenario::ctx(test),
    );

    clock::destroy_for_testing(clock);
    test_scenario::return_to_sender(test, student_profile);
    test_scenario::return_shared(grant);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

#[test]
#[expected_failure(abort_code = scholarflow::grant_system::DEMOGRAPHIC_MISMATCH)]
fun test_demographic_mismatch() {
    let mut scenario = test_scenario::begin(ADMIN);
    let test = &mut scenario;
    initialize(test, ADMIN);

    // Register student with different demographic
    test_scenario::next_tx(test, STUDENT1);
    let mut registry = test_scenario::take_shared<SystemRegistry>(test);
    let clock = clock::create_for_testing(test_scenario::ctx(test));

    register_student(
        string::utf8(b"Bob Jones"),
        22,
        string::utf8(b"middle-income"), // Different from grant requirement
        string::utf8(b"undergraduate"),
        &mut registry,
        &clock,
        test_scenario::ctx(test),
    );

    test_scenario::next_tx(test, STUDENT1);
    let mut student_profile = test_scenario::take_from_sender<StudentProfile>(test);
    verify_documents(&mut student_profile, &clock, test_scenario::ctx(test));

    // Create grant for low-income students
    test_scenario::next_tx(test, GRANT_OWNER);
    let funding_coin = coin::mint_for_testing<IOTA>(10000, test_scenario::ctx(test));

    create_grant(
        string::utf8(b"Low-Income Grant"),
        string::utf8(b"For low-income students only"),
        funding_coin,
        string::utf8(b"low-income"), // Grant requires low-income
        string::utf8(b"undergraduate"),
        2000,
        1735689600000,
        &mut registry,
        test_scenario::ctx(test),
    );

    // Try to apply with wrong demographic (should fail)
    test_scenario::next_tx(test, STUDENT1);
    let grant = test_scenario::take_shared<Grant>(test);

    apply_for_grant(
        &student_profile,
        &grant,
        string::utf8(b"I need funding"),
        1500,
        &clock,
        test_scenario::ctx(test),
    );

    clock::destroy_for_testing(clock);
    test_scenario::return_to_sender(test, student_profile);
    test_scenario::return_shared(grant);
    test_scenario::return_shared(registry);
    test_scenario::end(scenario);
}

// === Updated helper: only one &mut Scenario parameter ===
fun setup_student_with_funds(scenario: &mut Scenario) {
    // 1. Register and verify student
    test_scenario::next_tx(scenario, STUDENT1);
    let mut registry = test_scenario::take_shared<SystemRegistry>(scenario);
    let clock = clock::create_for_testing(test_scenario::ctx(scenario));

    register_student(
        string::utf8(b"Alice Smith"),
        20,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        &mut registry,
        &clock,
        test_scenario::ctx(scenario),
    );

    test_scenario::next_tx(scenario, STUDENT1);
    let mut student_profile = test_scenario::take_from_sender<StudentProfile>(scenario);

    verify_documents(
        &mut student_profile,
        &clock,
        test_scenario::ctx(scenario),
    );

    // 2. Create a grant (owned by GRANT_OWNER)
    test_scenario::next_tx(scenario, GRANT_OWNER);
    let funding_coin = coin::mint_for_testing<IOTA>(10000, test_scenario::ctx(scenario));

    create_grant(
        string::utf8(b"Education Grant"),
        string::utf8(b"Education support"),
        funding_coin,
        string::utf8(b"low-income"),
        string::utf8(b"undergraduate"),
        2000,
        1_735_689_600_000, // July 1, 2025 UTC in ms
        &mut registry,
        test_scenario::ctx(scenario),
    );

    // 3. Student applies for the grant
    test_scenario::next_tx(scenario, STUDENT1);
    let grant = test_scenario::take_shared<Grant>(scenario);

    apply_for_grant(
        &student_profile,
        &grant,
        string::utf8(b"Need funding for education"),
        1500,
        &clock,
        test_scenario::ctx(scenario),
    );

    test_scenario::return_shared(grant);

    // 4. Grant owner approves application
    test_scenario::next_tx(scenario, GRANT_OWNER);
    let mut grant_mut = test_scenario::take_shared<Grant>(scenario);
    let mut application = test_scenario::take_shared<GrantApplication>(scenario);

    // Student wallet must be taken from STUDENT1
    test_scenario::next_tx(scenario, STUDENT1);
    let mut student_wallet = test_scenario::take_from_sender<StudentWallet>(scenario);

    test_scenario::next_tx(scenario, GRANT_OWNER);
    approve_grant_application(
        &mut grant_mut,
        &mut application,
        &mut student_wallet,
        1500,
        test_scenario::ctx(scenario),
    );

    // Cleanup
    clock::destroy_for_testing(clock);

    // Return all resources
    test_scenario::return_to_sender(scenario, student_profile);
    test_scenario::return_to_sender(scenario, student_wallet);
    test_scenario::return_shared(grant_mut);
    test_scenario::return_shared(application);
    test_scenario::return_shared(registry);
}

fun initialize(scenario: &mut Scenario, admin: address) {
    test_scenario::next_tx(scenario, admin);
    {
        test_init(test_scenario::ctx(scenario));
    };
}
