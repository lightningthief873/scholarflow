// ScholarFlow Constants

export const PACKAGE_ID = "0x..."; // Replace with actual package ID after deployment

export const DEMOGRAPHICS = [
  "minority",
  "rural",
  "low-income",
  "first-generation",
  "disabled",
  "veteran",
  "other",
] as const;

export const EDUCATION_LEVELS = [
  "high-school",
  "undergraduate",
  "graduate",
  "doctoral",
  "vocational",
] as const;

export const STORE_TYPES = [
  "university",
  "bookstore",
  "online_course",
  "equipment",
  "software",
  "supplies",
] as const;

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const MERCHANT_TYPES = {
  EDUCATIONAL: "educational",
  REGULAR: "regular",
} as const;

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  GRANTS: "/grants",
  MARKETPLACE: "/marketplace",
  PROFILE: "/profile",
  ADMIN: "/admin",
  STORE: "/store",
} as const;

export const MOCK_DATA = {
  GRANTS: [
    {
      id: "1",
      grant_owner: "0x123...",
      title: "STEM Education Grant",
      description:
        "Supporting students in Science, Technology, Engineering, and Mathematics",
      total_funding: 50000,
      remaining_funding: 35000,
      target_demographic: "minority",
      target_education_level: "undergraduate",
      max_grant_per_student: 2500,
      application_deadline: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      is_active: true,
      approved_students: [],
    },
    {
      id: "2",
      grant_owner: "0x456...",
      title: "Rural Education Initiative",
      description:
        "Providing educational opportunities for students in rural areas",
      total_funding: 30000,
      remaining_funding: 20000,
      target_demographic: "rural",
      target_education_level: "high-school",
      max_grant_per_student: 1500,
      application_deadline: Date.now() + 45 * 24 * 60 * 60 * 1000, // 45 days from now
      is_active: true,
      approved_students: [],
    },
  ],

  STORES: [
    {
      id: "1",
      owner: "0x789...",
      name: "University Bookstore",
      store_type: "bookstore",
      is_verified_educational: true,
      items: [
        {
          item_id: 1,
          name: "Programming Textbook",
          description: "Comprehensive guide to programming fundamentals",
          price: 89.99,
          is_available: true,
        },
        {
          item_id: 2,
          name: "Scientific Calculator",
          description: "Advanced scientific calculator for mathematics",
          price: 45.0,
          is_available: true,
        },
      ],
    },
  ],

  SYSTEM_STATS: {
    id: "system",
    total_students: 1247,
    total_grants: 23,
    total_stores: 15,
    total_funding_distributed: 2400000,
  },
};
