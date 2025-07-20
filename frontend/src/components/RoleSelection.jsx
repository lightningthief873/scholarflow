import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  GraduationCap, 
  Users, 
  Shield, 
  ChevronRight,
  CheckCircle,
  User,
  Building,
  Crown
} from 'lucide-react'
import { motion } from 'framer-motion'

export function RoleSelection({ onRoleSelect, walletAddress }) {
  const [selectedRole, setSelectedRole] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Apply for grants, manage your educational funding, and purchase educational resources',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Apply for educational grants',
        'Track application status',
        'Manage grant funds',
        'Purchase educational resources',
        'View spending history'
      ]
    },
    {
      id: 'grant_owner',
      title: 'Grant Owner',
      description: 'Create and manage grants, review applications, and distribute funding',
      icon: Building,
      color: 'from-purple-500 to-pink-500',
      features: [
        'Create new grant programs',
        'Review student applications',
        'Approve/reject funding requests',
        'Monitor grant distribution',
        'Generate reports'
      ]
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Oversee the entire platform, manage users, and configure system settings',
      icon: Crown,
      color: 'from-orange-500 to-red-500',
      features: [
        'Manage all users and roles',
        'Configure system settings',
        'Monitor platform activity',
        'Generate analytics reports',
        'Moderate content and disputes'
      ]
    }
  ]

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleConfirmRole = async () => {
    if (!selectedRole) return
    
    setIsConfirming(true)
    
    // Simulate role confirmation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onRoleSelect(selectedRole)
    setIsConfirming(false)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to ScholarFlow</h1>
          <p className="text-gray-300 mb-4">
            Please select your role to access the appropriate features and interface
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Connected wallet:</span>
            <Badge variant="secondary" className="bg-white/10 text-white font-mono">
              {formatAddress(walletAddress)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map((role, index) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id
            
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white/20 border-white/40 shadow-lg' 
                      : 'bg-black/20 border-white/10 hover:bg-white/10'
                  } backdrop-blur-lg`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-r ${role.color} rounded-full flex items-center justify-center mb-4 relative`}>
                      <Icon className="h-8 w-8 text-white" />
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                    <CardTitle className="text-xl text-white">{role.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {role.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-white mb-3">Key Features:</h4>
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {selectedRole && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-black/20 backdrop-blur-lg border-white/10 max-w-md mx-auto">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className={`w-8 h-8 bg-gradient-to-r ${roles.find(r => r.id === selectedRole)?.color} rounded-full flex items-center justify-center`}>
                    {(() => {
                      const SelectedIcon = roles.find(r => r.id === selectedRole)?.icon
                      return <SelectedIcon className="h-4 w-4 text-white" />
                    })()}
                  </div>
                  <span className="text-white font-medium">
                    Selected: {roles.find(r => r.id === selectedRole)?.title}
                  </span>
                </div>
                
                <Button
                  onClick={handleConfirmRole}
                  disabled={isConfirming}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium"
                  size="lg"
                >
                  {isConfirming ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Confirming Role...
                    </>
                  ) : (
                    <>
                      Continue as {roles.find(r => r.id === selectedRole)?.title}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

