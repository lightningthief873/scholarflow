import { ConnectButton, useCurrentAccount } from "@iota/dapp-kit";
import { Flex, Heading } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useScholarFlow } from "../hooks/useScholarFlow";
import { WalletSignIn } from "../components/WalletSignIn";
import { ProfileCreationFlow } from "../components/ProfileCreationFlow";
import { StudentRegistration } from "../components/StudentRegistration";
import { GrantApplicationForm } from "../components/GrantApplicationForm";
import { GrantCreationForm } from "../components/GrantCreationForm";
import { ApplicationManagement } from "../components/ApplicationManagement";
import type { Grant, UserRole } from "./types";

function App() {
  const currentAccount = useCurrentAccount();
  const {
    grants,
    applications,
    studentProfile,
    studentWallet,
    stores,
    systemStats,
    isConnected,
    loading,
    error,
    purchaseItem,
    clearError,
  } = useScholarFlow();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("student");
  const [showRegistration, setShowRegistration] = useState(false);
  const [showGrantApplication, setShowGrantApplication] =
    useState<Grant | null>(null);
  const [showGrantCreation, setShowGrantCreation] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [needsProfileCreation, setNeedsProfileCreation] = useState(false);

  // Check wallet connection and profile status
  useEffect(() => {
    if (currentAccount) {
      setIsSignedIn(true);
      // Check if user needs to create profile
      if (userRole === "student" && !studentProfile) {
        setNeedsProfileCreation(true);
      } else {
        setNeedsProfileCreation(false);
      }
    } else {
      setIsSignedIn(false);
      setNeedsProfileCreation(false);
    }
  }, [currentAccount, studentProfile, userRole]);

  // Handle sign-in completion
  const handleSignInComplete = () => {
    setIsSignedIn(true);
    if (userRole === "student" && !studentProfile) {
      setNeedsProfileCreation(true);
    }
  };

  // Handle profile creation completion
  const handleProfileCreated = () => {
    setNeedsProfileCreation(false);
  };

  // Show sign-in screen if not connected
  if (!isSignedIn || !currentAccount) {
    return <WalletSignIn onSignInComplete={handleSignInComplete} />;
  }

  // Show profile creation flow if needed
  if (needsProfileCreation) {
    return (
      <ProfileCreationFlow
        userRole={userRole}
        onProfileCreated={handleProfileCreated}
      />
    );
  }

  const handlePurchase = async (
    storeId: string,
    itemId: number,
    amount: number,
  ) => {
    try {
      await purchaseItem(storeId, itemId, amount);
      alert("Purchase successful!");
    } catch (err) {
      console.error("Purchase failed:", err);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const renderTabButton = (tabId: string, label: string, count?: number) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
        activeTab === tabId
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
          : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{label}</span>
        {count !== undefined && (
          <span
            className={`text-xs px-2 py-1 rounded-full font-bold ${
              activeTab === tabId
                ? "bg-white/20 text-white"
                : "bg-gray-600 text-gray-300"
            }`}
          >
            {count}
          </span>
        )}
      </div>
    </button>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-gray-400 text-sm font-medium">Total Students</h3>
          <p className="text-2xl font-bold text-white">
            {systemStats.total_students.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-gray-400 text-sm font-medium">Active Grants</h3>
          <p className="text-2xl font-bold text-white">
            {systemStats.total_grants}
          </p>
        </div>
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-gray-400 text-sm font-medium">
            Funds Distributed
          </h3>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(systemStats.total_funding_distributed)}
          </p>
        </div>
      </div>

      {isConnected && (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Wallet Status
          </h3>
          {studentWallet ? (
            <div className="space-y-2">
              <p className="text-white">
                Available Balance:{" "}
                <span className="font-semibold text-green-400">
                  {formatCurrency(studentWallet.available_balance)}
                </span>
              </p>
              <p className="text-gray-300">
                Total Received: {formatCurrency(studentWallet.total_received)}
              </p>
              <p className="text-gray-300">
                Total Spent:{" "}
                {formatCurrency(
                  studentWallet.total_received -
                    studentWallet.available_balance,
                )}
              </p>
            </div>
          ) : (
            <p className="text-gray-400">
              Wallet not connected or no student profile found
            </p>
          )}
        </div>
      )}

      {isConnected &&
        studentWallet &&
        studentWallet.spending_history.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {studentWallet.spending_history
                .slice(0, 5)
                .map((record, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {record.item_description}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatDate(record.timestamp)}
                      </p>
                    </div>
                    <p className="text-red-400 font-medium">
                      -{formatCurrency(record.amount)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );

  const renderGrants = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Available Grants</h2>
        {userRole === "admin" && (
          <button
            onClick={() => setShowGrantCreation(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Grant
          </button>
        )}
      </div>

      <div className="space-y-4">
        {grants
          .filter((grant) => grant.is_active)
          .map((grant) => (
            <div
              key={grant.id}
              className="bg-gray-700 p-6 rounded-lg border border-gray-600"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {grant.title}
                  </h3>
                  <p className="text-gray-300 mb-3">{grant.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Total Funding:</span>
                      <span className="text-white ml-2">
                        {formatCurrency(grant.total_funding)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Remaining:</span>
                      <span className="text-white ml-2">
                        {formatCurrency(grant.remaining_funding)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Max per Student:</span>
                      <span className="text-white ml-2">
                        {formatCurrency(grant.max_grant_per_student)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Deadline:</span>
                      <span className="text-white ml-2">
                        {formatDate(grant.application_deadline)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-900 text-green-100 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Active
                  </div>
                  {userRole === "student" && studentProfile && (
                    <button
                      onClick={() => setShowGrantApplication(grant)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Target:</span>
                  <span className="text-white ml-2 capitalize">
                    {grant.target_demographic.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Education:</span>
                  <span className="text-white ml-2 capitalize">
                    {grant.target_education_level.replace("-", " ")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Applicants:</span>
                  <span className="text-white ml-2">
                    {grant.approved_students.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Educational Marketplace</h2>
      <p className="text-gray-300">
        Purchase educational items using your grant funds from verified
        educational stores.
      </p>

      <div className="space-y-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-gray-700 p-6 rounded-lg border border-gray-600"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {store.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-400 capitalize">
                    {store.store_type.replace("_", " ")}
                  </span>
                  {store.is_verified_educational && (
                    <span className="bg-blue-900 text-blue-100 px-2 py-1 rounded text-xs font-medium">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.items
                .filter((item) => item.is_available)
                .map((item) => (
                  <div
                    key={item.item_id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-600"
                  >
                    <h4 className="font-semibold text-white mb-2">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">
                        {formatCurrency(item.price)}
                      </span>
                      <button
                        onClick={() =>
                          handlePurchase(store.id, item.item_id, item.price)
                        }
                        disabled={
                          !studentWallet ||
                          studentWallet.available_balance < item.price ||
                          loading
                        }
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        {loading ? "Processing..." : "Purchase"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Student Profile</h2>

      {studentProfile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">
              Personal Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Name:</span>
                <span className="text-white ml-2">{studentProfile.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Age:</span>
                <span className="text-white ml-2">{studentProfile.age}</span>
              </div>
              <div>
                <span className="text-gray-400">Demographic:</span>
                <span className="text-white ml-2 capitalize">
                  {studentProfile.demographic.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Education Level:</span>
                <span className="text-white ml-2 capitalize">
                  {studentProfile.education_level.replace("-", " ")}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Verification Status:</span>
                <span
                  className={`ml-2 ${studentProfile.documents_verified ? "text-green-400" : "text-red-400"}`}
                >
                  {studentProfile.documents_verified ? "Verified" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">
              Grant Summary
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Total Grants Received:</span>
                <span className="text-white ml-2">
                  {studentProfile.total_grants_received}
                </span>
              </div>
              {studentWallet && (
                <>
                  <div>
                    <span className="text-gray-400">
                      Total Amount Received:
                    </span>
                    <span className="text-white ml-2">
                      {formatCurrency(studentWallet.total_received)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Available Balance:</span>
                    <span className="text-green-400 ml-2 font-semibold">
                      {formatCurrency(studentWallet.available_balance)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Spent:</span>
                    <span className="text-white ml-2">
                      {formatCurrency(
                        studentWallet.total_received -
                          studentWallet.available_balance,
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600 text-center">
          <p className="text-gray-400">
            No profile found. Please register as a student.
          </p>
        </div>
      )}

      {studentWallet && studentWallet.spending_history.length > 0 && (
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">
            Spending History
          </h3>
          <div className="space-y-3">
            {studentWallet.spending_history.map((record, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-gray-600"
              >
                <div>
                  <p className="text-white font-medium">
                    {record.item_description}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDate(record.timestamp)} • {record.merchant_type}
                  </p>
                </div>
                <p className="text-red-400 font-medium">
                  {formatCurrency(record.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderAdmin = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowGrantCreation(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Grant
          </button>
        </div>
      </div>

      <ApplicationManagement applications={applications} grants={grants} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="backdrop-blur-sm bg-black/20">
        {/* Header */}
        <header className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Flex justify="between" align="center">
              <Flex align="center" gap="3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <Heading size="6" className="text-white font-bold">
                      ScholarFlow
                    </Heading>
                    <p className="text-gray-400 text-sm">
                      Decentralized Grant Management
                    </p>
                  </div>
                </div>
              </Flex>

              <Flex align="center" gap="4">
                {/* User Info */}
                <div className="hidden md:flex items-center gap-3 bg-gray-800/50 rounded-lg px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {currentAccount?.address.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-medium capitalize">
                      {userRole}
                    </p>
                    <p className="text-gray-400 font-mono text-xs">
                      {currentAccount?.address.slice(0, 8)}...
                      {currentAccount?.address.slice(-4)}
                    </p>
                  </div>
                </div>

                {/* Role Selector */}
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-gray-800/50 border border-gray-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="store_owner">Store Owner</option>
                </select>

                <ConnectButton />
              </Flex>
            </Flex>
          </div>
        </header>

        {/* Error Display */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={clearError}
                  className="text-red-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          {showRegistration ? (
            <StudentRegistration
              onRegistrationComplete={() => setShowRegistration(false)}
            />
          ) : showGrantApplication ? (
            <GrantApplicationForm
              grant={showGrantApplication}
              onApplicationSubmitted={() => setShowGrantApplication(null)}
              onCancel={() => setShowGrantApplication(null)}
            />
          ) : showGrantCreation ? (
            <GrantCreationForm
              onGrantCreated={() => setShowGrantCreation(false)}
              onCancel={() => setShowGrantCreation(false)}
            />
          ) : (
            <>
              {/* Navigation Tabs */}
              <div className="mb-8">
                <div className="flex gap-2 bg-gray-800/30 p-2 rounded-xl backdrop-blur-sm border border-gray-700/50">
                  {renderTabButton("dashboard", "Dashboard")}
                  {renderTabButton(
                    "grants",
                    "Grants",
                    grants.filter((g) => g.is_active).length,
                  )}
                  {renderTabButton("marketplace", "Marketplace")}
                  {userRole === "student" &&
                    renderTabButton("profile", "Profile")}
                  {userRole === "admin" &&
                    renderTabButton(
                      "admin",
                      "Admin",
                      applications.filter((a) => a.status === "pending").length,
                    )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                {activeTab === "dashboard" && renderDashboard()}
                {activeTab === "grants" && renderGrants()}
                {activeTab === "marketplace" && renderMarketplace()}
                {activeTab === "profile" && renderProfile()}
                {activeTab === "admin" && renderAdmin()}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
