// ScholarFlow Types

export interface StudentProfile {
  id: string;
  student_address: string;
  name: string;
  age: number;
  demographic: string;
  education_level: string;
  documents_verified: boolean;
  verification_timestamp: number;
  total_grants_received: number;
}

export interface Grant {
  id: string;
  grant_owner: string;
  title: string;
  description: string;
  total_funding: number;
  remaining_funding: number;
  target_demographic: string;
  target_education_level: string;
  max_grant_per_student: number;
  application_deadline: number;
  is_active: boolean;
  approved_students: string[];
}

export interface GrantApplication {
  id: string;
  grant_id: string;
  student_address: string;
  application_text: string;
  requested_amount: number;
  application_timestamp: number;
  status: "pending" | "approved" | "rejected";
}

export interface StudentWallet {
  id: string;
  student_address: string;
  available_balance: number;
  total_received: number;
  spending_history: SpendingRecord[];
}

export interface SpendingRecord {
  amount: number;
  merchant_address: string;
  merchant_type: string;
  item_description: string;
  timestamp: number;
}

export interface EducationalStore {
  id: string;
  owner: string;
  name: string;
  store_type: string;
  is_verified_educational: boolean;
  items: StoreItem[];
}

export interface StoreItem {
  item_id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
}

export interface SystemRegistry {
  id: string;
  total_students: number;
  total_grants: number;
  total_stores: number;
  total_funding_distributed: number;
}

export type UserRole = "student" | "admin" | "store_owner";

export interface AppState {
  currentUser: {
    address: string;
    role: UserRole;
    profile?: StudentProfile;
  } | null;
  grants: Grant[];
  applications: GrantApplication[];
  wallet?: StudentWallet;
  stores: EducationalStore[];
  systemStats: SystemRegistry;
}

