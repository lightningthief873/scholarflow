import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { 
  Wallet, 
  CheckCircle, 
  AlertCircle, 
  Copy,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function WalletConnection({ onConnect, isConnected, walletAddress }) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState('')
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [balance, setBalance] = useState('0')
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [copied, setCopied] = useState(false)

  // Check for IOTA wallet extension
  const [hasIotaWallet, setHasIotaWallet] = useState(false)

  useEffect(() => {
    // Check if IOTA wallet extension is available
    const checkWallet = () => {
      if (typeof window !== 'undefined') {
        setHasIotaWallet(!!window.iota || !!window.iotaWallet)
      }
    }
    
    checkWallet()
    
    // Listen for wallet extension injection
    const timer = setTimeout(checkWallet, 1000)
    return () => clearTimeout(timer)
  }, [])

  const fetchBalance = async (address) => {
    if (!address) return
    
    setIsLoadingBalance(true)
    try {
      // Simulate balance fetch - in real implementation, use IOTA SDK
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockBalance = (Math.random() * 1000).toFixed(6)
      setBalance(mockBalance)
    } catch (error) {
      console.error('Failed to fetch balance:', error)
      setBalance('0')
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    setConnectionError('')
    
    try {
      if (hasIotaWallet) {
        // Try to connect to IOTA wallet extension
        let accounts = []
        
        if (window.iota) {
          accounts = await window.iota.connect()
        } else if (window.iotaWallet) {
          accounts = await window.iotaWallet.connect()
        }
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0].address || accounts[0]
          onConnect(address)
          await fetchBalance(address)
        } else {
          throw new Error('No accounts found')
        }
      } else {
        // Simulate connection for demo purposes
        await new Promise(resolve => setTimeout(resolve, 2000))
        const mockAddress = 'iota1qpg2xkj66wwgn8p2ggnp7p582gj8g5r5r5r5r5r5r5r5r5r5r5r5r5r5'
        onConnect(mockAddress)
        await fetchBalance(mockAddress)
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      setConnectionError(
        hasIotaWallet 
          ? 'Failed to connect to IOTA wallet. Please make sure it is unlocked and try again.'
          : 'IOTA wallet extension not found. Please install the IOTA wallet extension and try again.'
      )
    } finally {
      setIsConnecting(false)
    }
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  // If not connected, show connection screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
              >
                <Wallet className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">Connect Your IOTA Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Connect your IOTA wallet to access ScholarFlow and manage your grants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {connectionError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-300 text-sm">{connectionError}</span>
                </motion.div>
              )}

              <div className="flex items-center gap-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <div className={`h-2 w-2 rounded-full ${hasIotaWallet ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-blue-300 text-sm">
                  IOTA Wallet Extension: {hasIotaWallet ? 'Detected' : 'Not Found'}
                </span>
              </div>

              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    {hasIotaWallet ? 'Connect IOTA Wallet' : 'Connect (Demo Mode)'}
                  </>
                )}
              </Button>

              {!hasIotaWallet && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://chrome.google.com/webstore/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija', '_blank')}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Install IOTA Wallet
                  </Button>
                </div>
              )}

              <div className="text-center text-sm text-gray-400">
                <p>Supported: IOTA Wallet Extension, Demo Mode</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // If connected, show wallet info in header
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <span className="text-green-300 text-sm font-medium">IOTA Wallet Connected</span>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg">
        <div className="text-right">
          <p className="text-xs text-gray-400">Balance</p>
          <p className="text-sm font-medium text-white">
            {isLoadingBalance ? (
              <Loader2 className="h-3 w-3 animate-spin inline" />
            ) : (
              `${balance} IOTA`
            )}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={copyAddress}
        className="text-white hover:bg-white/10"
      >
        <span className="text-sm font-mono">{formatAddress(walletAddress)}</span>
        {copied ? (
          <CheckCircle className="h-3 w-3 ml-2 text-green-400" />
        ) : (
          <Copy className="h-3 w-3 ml-2" />
        )}
      </Button>
    </div>
  )
}

