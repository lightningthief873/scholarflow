import { useState, useEffect } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { PACKAGE_ID, MOCK_DATA } from "../src/constants";
import type {
  Grant,
  GrantApplication,
  StudentProfile,
  StudentWallet,
  EducationalStore,
  SystemRegistry,
} from "../src/types";

export function useScholarFlow() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  // State management
  const [grants, setGrants] = useState<Grant[]>(MOCK_DATA.GRANTS);
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [studentWallet, setStudentWallet] = useState<StudentWallet | null>(
    null,
  );
  const [stores] = useState<EducationalStore[]>(MOCK_DATA.STORES);
  const [systemStats] = useState<SystemRegistry>(MOCK_DATA.SYSTEM_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user data when account changes
  useEffect(() => {
    if (currentAccount?.address) {
      loadUserData(currentAccount.address);
    } else {
      resetUserData();
    }
  }, [currentAccount]);

  const loadUserData = async (address: string) => {
    setLoading(true);
    try {
      // In a real implementation, these would be blockchain calls
      // For now, using mock data

      // Check if student profile exists
      const mockProfile: StudentProfile = {
        id: "profile_" + address,
        student_address: address,
        name: "John Doe",
        age: 22,
        demographic: "minority",
        education_level: "undergraduate",
        documents_verified: true,
        verification_timestamp: Date.now(),
        total_grants_received: 2,
      };
      setStudentProfile(mockProfile);

      // Load student wallet
      const mockWallet: StudentWallet = {
        id: "wallet_" + address,
        student_address: address,
        available_balance: 2350,
        total_received: 5000,
        spending_history: [
          {
            amount: 89.99,
            merchant_address: "0x789...",
            merchant_type: "educational",
            item_description: "Programming Textbook",
            timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
          },
        ],
      };
      setStudentWallet(mockWallet);

      // Load applications
      const mockApplications: GrantApplication[] = [
        {
          id: "app_1",
          grant_id: "1",
          student_address: address,
          application_text:
            "I am applying for this grant to support my STEM education...",
          requested_amount: 2000,
          application_timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
          status: "pending",
        },
      ];
      setApplications(mockApplications);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const resetUserData = () => {
    setStudentProfile(null);
    setStudentWallet(null);
    setApplications([]);
  };

  // Student functions
  const registerStudent = async (
    name: string,
    age: number,
    demographic: string,
    education_level: string,
  ) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const tx = new Transaction();

      // In a real implementation, this would call the smart contract
      tx.moveCall({
        target: `${PACKAGE_ID}::grant_system::register_student`,
        arguments: [
          tx.pure.address(currentAccount.address),
          tx.pure.string(name),
          tx.pure.u64(age),
          tx.pure.string(demographic),
          tx.pure.string(education_level),
        ],
      });

      await new Promise((resolve) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Student registered:", result);
              loadUserData(currentAccount.address);
              resolve(result);
            },
            onError: (error) => {
              setError(error.message);
              throw error;
            },
          },
        );
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to register student",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitGrantApplication = async (
    grantId: string,
    applicationText: string,
    requestedAmount: number,
  ) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::grant_system::submit_grant_application`,
        arguments: [
          tx.object(studentProfile?.id || ""),
          tx.object(grantId),
          tx.pure.string(applicationText),
          tx.pure.u64(requestedAmount),
        ],
      });

      await new Promise((resolve) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Application submitted:", result);

              // Add to local state
              const newApplication: GrantApplication = {
                id: "app_" + Date.now(),
                grant_id: grantId,
                student_address: currentAccount.address,
                application_text: applicationText,
                requested_amount: requestedAmount,
                application_timestamp: Date.now(),
                status: "pending",
              };
              setApplications((prev) => [...prev, newApplication]);
              resolve(result);
            },
            onError: (error) => {
              setError(error.message);
              throw error;
            },
          },
        );
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit application",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const purchaseItem = async (
    storeId: string,
    itemId: number,
    amount: number,
  ) => {
    if (!currentAccount || !studentWallet)
      throw new Error("Wallet not connected or no wallet found");

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::grant_system::purchase_item_educational`,
        arguments: [
          tx.object(studentWallet.id),
          tx.object(storeId),
          tx.pure.u64(itemId),
        ],
      });

      await new Promise((resolve) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Item purchased:", result);

              // Update wallet balance
              setStudentWallet((prev) =>
                prev
                  ? {
                      ...prev,
                      available_balance: prev.available_balance - amount,
                      spending_history: [
                        ...prev.spending_history,
                        {
                          amount,
                          merchant_address: storeId,
                          merchant_type: "educational",
                          item_description: `Item ${itemId}`,
                          timestamp: Date.now(),
                        },
                      ],
                    }
                  : null,
              );
              resolve(result);
            },
            onError: (error) => {
              setError(error.message);
              throw error;
            },
          },
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to purchase item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin functions
  const createGrant = async (
    title: string,
    description: string,
    totalFunding: number,
    targetDemographic: string,
    targetEducationLevel: string,
    maxGrantPerStudent: number,
    applicationDeadline: number,
  ) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::grant_system::create_grant`,
        arguments: [
          tx.object("admin_cap_id"), // Admin capability object
          tx.pure.string(title),
          tx.pure.string(description),
          tx.pure.u64(totalFunding),
          tx.pure.string(targetDemographic),
          tx.pure.string(targetEducationLevel),
          tx.pure.u64(maxGrantPerStudent),
          tx.pure.u64(applicationDeadline),
        ],
      });

      await new Promise((resolve) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Grant created:", result);

              // Add to local state
              const newGrant: Grant = {
                id: "grant_" + Date.now(),
                grant_owner: currentAccount.address,
                title,
                description,
                total_funding: totalFunding,
                remaining_funding: totalFunding,
                target_demographic: targetDemographic,
                target_education_level: targetEducationLevel,
                max_grant_per_student: maxGrantPerStudent,
                application_deadline: applicationDeadline,
                is_active: true,
                approved_students: [],
              };
              setGrants((prev) => [...prev, newGrant]);
              resolve(result);
            },
            onError: (error) => {
              setError(error.message);
              throw error;
            },
          },
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create grant");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string) => {
    if (!currentAccount) throw new Error("Wallet not connected");

    setLoading(true);
    try {
      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::grant_system::approve_grant_application`,
        arguments: [
          tx.object("admin_cap_id"),
          tx.object("grant_id"),
          tx.object(applicationId),
        ],
      });

      await new Promise((resolve) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log("Application approved:", result);

              // Update application status
              setApplications((prev) =>
                prev.map((app) =>
                  app.id === applicationId
                    ? { ...app, status: "approved" as const }
                    : app,
                ),
              );
              resolve(result);
            },
            onError: (error) => {
              setError(error.message);
              throw error;
            },
          },
        );
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve application",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    grants,
    applications,
    studentProfile,
    studentWallet,
    stores,
    systemStats,
    loading,
    error,
    isConnected: !!currentAccount,
    currentAddress: currentAccount?.address,

    // Student functions
    registerStudent,
    submitGrantApplication,
    purchaseItem,

    // Admin functions
    createGrant,
    approveApplication,

    // Utility
    clearError: () => setError(null),
  };
}
