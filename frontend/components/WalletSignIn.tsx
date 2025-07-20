import { ConnectButton, useCurrentAccount } from "@iota/dapp-kit";
import { Button } from '@radix-ui/themes';

interface WalletSignInProps {
  onSignInComplete: () => void;
}

export function WalletSignIn({ onSignInComplete }: WalletSignInProps) {
  const currentAccount = useCurrentAccount();

  const handleConnectSuccess = () => {
    if (currentAccount) {
      onSignInComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ScholarFlow</h1>
          <p className="text-gray-300">Decentralized Grant Management System</p>
        </div>

        {/* Sign In Card */}
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 text-sm">
              Sign in with your IOTA wallet to access ScholarFlow
            </p>
          </div>

          {!currentAccount ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <ConnectButton />
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-green-400 font-medium">Wallet Connected</p>
                    <p className="text-gray-400 text-sm font-mono">
                      {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConnectSuccess}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Continue to ScholarFlow
              </Button>
            </div>
          )}

          {/* Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-4">What you can do with ScholarFlow:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Apply for educational grants</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Purchase educational materials</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Track your grant funding</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            Powered by IOTA blockchain technology
          </p>
        </div>
      </div>
    </div>
  );
}

