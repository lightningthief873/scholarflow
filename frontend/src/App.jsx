import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  GraduationCap, 
  Wallet, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Award, 
  ShoppingCart,
  Settings,
  Bell,
  Search,
  Filter,
  Calendar,
  MapPin,
  Star,
  ChevronRight,
  Plus,
  Eye,
  Download,
  Share2,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  Activity,
  Building,
  Crown,
  FileText,
  UserCheck,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { WalletConnection } from './components/WalletConnection.jsx'
import { RoleSelection } from './components/RoleSelection.jsx'
import { GrantApplicationModal } from './components/GrantApplicationModal.jsx'
import './App.css'

// Mock data for demonstration
const mockData = {
  user: {
    name: "Alex Johnson",
    role: "Student",
    avatar: "/api/placeholder/32/32"
  },
  stats: {
    totalGrants: 156,
    totalFunding: 2450000,
    activeApplications: 23,
    successRate: 78
  },
  grants: [
    {
      id: 1,
      title: "STEM Excellence Grant",
      description: "Supporting outstanding students in Science, Technology, Engineering, and Mathematics fields.",
      amount: 5000,
      category: "STEM",
      deadline: "2024-02-15",
      status: "Active",
      applications: 45,
      location: "Global",
      totalFunding: 50000,
      remainingFunding: 35000,
      maxPerStudent: 5000,
      applicants: 45
    },
    {
      id: 2,
      title: "Diversity in Tech Scholarship",
      description: "Promoting diversity and inclusion in technology education and careers.",
      amount: 3000,
      category: "Technology",
      deadline: "2024-02-20",
      status: "Active",
      applications: 32,
      location: "USA",
      totalFunding: 30000,
      remainingFunding: 21000,
      maxPerStudent: 3000,
      applicants: 32
    },
    {
      id: 3,
      title: "Green Innovation Fund",
      description: "Supporting sustainable technology and environmental innovation projects.",
      amount: 7500,
      category: "Environment",
      deadline: "2024-03-01",
      status: "Active",
      applications: 28,
      location: "Europe",
      totalFunding: 75000,
      remainingFunding: 54000,
      maxPerStudent: 7500,
      applicants: 28
    }
  ],
  marketplace: [
    {
      id: 1,
      name: "Advanced Calculus Textbook",
      provider: "Academic Press",
      price: 89.99,
      category: "Books",
      rating: 4.8
    },
    {
      id: 2,
      name: "Python Programming Course",
      provider: "TechEdu",
      price: 199.99,
      category: "Courses",
      rating: 4.9
    },
    {
      id: 3,
      name: "Scientific Calculator",
      provider: "MathTools",
      price: 45.99,
      category: "Equipment",
      rating: 4.7
    }
  ]
}

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [userRole, setUserRole] = useState('')
  const [selectedGrant, setSelectedGrant] = useState(null)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your STEM Excellence Grant application has been approved!", type: "success", time: "2 hours ago" },
    { id: 2, message: "New grant opportunity: Green Innovation Fund", type: "info", time: "1 day ago" },
    { id: 3, message: "Reminder: Diversity in Tech Scholarship deadline in 5 days", type: "warning", time: "2 days ago" }
  ])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleWalletConnect = (address) => {
    setIsWalletConnected(true)
    setWalletAddress(address)
  }

  const handleRoleSelect = (role) => {
    setUserRole(role)
    updateNotificationsForRole(role)
  }

  const updateNotificationsForRole = (role) => {
    let roleNotifications = []
    
    switch (role) {
      case 'student':
        roleNotifications = [
          { id: 1, message: "Your STEM Excellence Grant application has been approved!", type: "success", time: "2 hours ago" },
          { id: 2, message: "New grant opportunity: Green Innovation Fund", type: "info", time: "1 day ago" },
          { id: 3, message: "Reminder: Diversity in Tech Scholarship deadline in 5 days", type: "warning", time: "2 days ago" }
        ]
        break
      case 'grant_owner':
        roleNotifications = [
          { id: 1, message: "5 new applications received for your STEM Grant", type: "info", time: "1 hour ago" },
          { id: 2, message: "Grant funding deadline approaching in 3 days", type: "warning", time: "4 hours ago" },
          { id: 3, message: "Monthly grant report is ready for review", type: "info", time: "1 day ago" }
        ]
        break
      case 'admin':
        roleNotifications = [
          { id: 1, message: "System maintenance scheduled for tonight", type: "warning", time: "30 minutes ago" },
          { id: 2, message: "New grant owner registration requires approval", type: "info", time: "2 hours ago" },
          { id: 3, message: "Monthly platform analytics report generated", type: "info", time: "1 day ago" }
        ]
        break
    }
    
    setNotifications(roleNotifications)
  }

  const handleGrantApplication = (grant) => {
    setSelectedGrant(grant)
    setIsApplicationModalOpen(true)
  }

  const handleApplicationSubmit = (applicationData) => {
    console.log('Application submitted:', applicationData)
    setIsApplicationModalOpen(false)
    setSelectedGrant(null)
  }

  // Get role-specific tabs
  const getRoleTabs = () => {
    const baseTabs = [
      { id: "dashboard", label: "Dashboard", icon: BarChart3 }
    ]
    
    switch (userRole) {
      case 'student':
        return [
          ...baseTabs,
          { id: "grants", label: "Available Grants", icon: Award },
          { id: "applications", label: "My Applications", icon: FileText },
          { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
          { id: "profile", label: "Profile", icon: Users }
        ]
      case 'grant_owner':
        return [
          ...baseTabs,
          { id: "my_grants", label: "My Grants", icon: Building },
          { id: "applications", label: "Applications", icon: FileText },
          { id: "analytics", label: "Analytics", icon: PieChart },
          { id: "profile", label: "Profile", icon: Users }
        ]
      case 'admin':
        return [
          ...baseTabs,
          { id: "users", label: "User Management", icon: UserCheck },
          { id: "grants", label: "All Grants", icon: Award },
          { id: "system", label: "System Settings", icon: Settings },
          { id: "analytics", label: "Platform Analytics", icon: PieChart }
        ]
      default:
        return baseTabs
    }
  }

  const getRoleTitle = () => {
    switch (userRole) {
      case 'student': return 'Student Portal'
      case 'grant_owner': return 'Grant Owner Dashboard'
      case 'admin': return 'Administrator Panel'
      default: return 'ScholarFlow'
    }
  }

  const getRoleIcon = () => {
    switch (userRole) {
      case 'student': return GraduationCap
      case 'grant_owner': return Building
      case 'admin': return Crown
      default: return GraduationCap
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const StatCard = ({ icon: Icon, title, value, change, color = "blue" }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 text-${color}-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{change}%</span> from last month
            </p>
          )}
        </CardContent>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-${color}-500 to-${color}-600`} />
      </Card>
    </motion.div>
  )

  const GrantCard = ({ grant, onApply, isAdmin }) => (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant={grant.status === 'Active' ? 'default' : 'secondary'}>
              {grant.status}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(grant.deadline)}</span>
            </div>
          </div>
          <CardTitle className="text-lg">{grant.title}</CardTitle>
          <CardDescription>{grant.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Amount:</span>
              <span className="font-medium text-green-600">{formatCurrency(grant.amount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Category:</span>
              <span className="font-medium">{grant.category}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Applications:</span>
              <span className="font-medium">{grant.applications}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{grant.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-3 w-3 text-yellow-500" />
              <span className="text-muted-foreground">4.8 rating</span>
            </div>
            <div className="pt-2">
              {isAdmin ? (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                </div>
              ) : onApply ? (
                <Button 
                  onClick={() => onApply(grant)} 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  size="sm"
                >
                  Apply Now
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const MarketplaceCard = ({ item }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{item.provider}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{item.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="outline">{item.category}</Badge>
            <span className="text-lg font-bold">{formatCurrency(item.price)}</span>
          </div>
          <Button className="w-full" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  // Show wallet connection screen if not connected
  if (!isWalletConnected) {
    return (
      <WalletConnection 
        onConnect={handleWalletConnect}
        isConnected={isWalletConnected}
        walletAddress={walletAddress}
      />
    )
  }

  // Show role selection if wallet is connected but no role selected
  if (!userRole) {
    return (
      <RoleSelection 
        onRoleSelect={handleRoleSelect}
        walletAddress={walletAddress}
      />
    )
  }

  const roleTabs = getRoleTabs()
  const RoleIcon = getRoleIcon()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            >
              <RoleIcon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold">{getRoleTitle()}</h1>
              <p className="text-xs text-muted-foreground">Decentralized Grant Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            
            <WalletConnection 
              onConnect={handleWalletConnect}
              isConnected={isWalletConnected}
              walletAddress={walletAddress}
            />
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {mockData.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{mockData.user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
            {roleTabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <TabIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-muted-foreground">Welcome back, {mockData.user.name}!</p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Award}
                title="Total Grants"
                value={mockData.stats.totalGrants}
                change={12}
                color="blue"
              />
              <StatCard
                icon={DollarSign}
                title="Total Funding"
                value={formatCurrency(mockData.stats.totalFunding)}
                change={8}
                color="green"
              />
              <StatCard
                icon={Users}
                title="Active Applications"
                value={mockData.stats.activeApplications}
                change={15}
                color="purple"
              />
              <StatCard
                icon={TrendingUp}
                title="Success Rate"
                value={`${mockData.stats.successRate}%`}
                change={5}
                color="orange"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest grant activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userRole === 'student' && (
                    <>
                      <Button className="w-full justify-start" variant="outline">
                        <Award className="h-4 w-4 mr-2" />
                        Browse Available Grants
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Check Application Status
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Visit Marketplace
                      </Button>
                    </>
                  )}
                  {userRole === 'grant_owner' && (
                    <>
                      <Button className="w-full justify-start" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Grant
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Review Applications
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </>
                  )}
                  {userRole === 'admin' && (
                    <>
                      <Button className="w-full justify-start" variant="outline">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        System Settings
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <PieChart className="h-4 w-4 mr-2" />
                        Platform Analytics
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grants Tab (Student and Admin) */}
          {(userRole === 'student' || userRole === 'admin') && (
            <TabsContent value="grants" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {userRole === 'admin' ? 'All Grants' : 'Available Grants'}
                  </h2>
                  <p className="text-muted-foreground">
                    {userRole === 'admin' ? 'Monitor and manage all platform grants' : 'Discover funding opportunities for your education'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  {userRole === 'admin' && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Grant
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockData.grants.map((grant) => (
                  <GrantCard 
                    key={grant.id} 
                    grant={grant} 
                    onApply={userRole === 'student' ? handleGrantApplication : undefined}
                    isAdmin={userRole === 'admin'}
                  />
                ))}
              </div>
            </TabsContent>
          )}

          {/* Marketplace Tab (Student) */}
          {userRole === 'student' && (
            <TabsContent value="marketplace" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Educational Marketplace</h2>
                  <p className="text-muted-foreground">Purchase educational resources with your grant funds</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockData.marketplace.map((item) => (
                  <MarketplaceCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          )}

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Profile</h2>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg">
                        {mockData.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{mockData.user.name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{userRole.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground font-mono">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your activity summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Member since:</span>
                    <span className="font-medium">January 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total applications:</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success rate:</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total funding received:</span>
                    <span className="font-medium">{formatCurrency(15000)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Grant Application Modal */}
      <GrantApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        grant={selectedGrant}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  )
}

export default App

