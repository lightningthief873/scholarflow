import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Calendar,
  User,
  GraduationCap,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function GrantApplicationModal({ grant, isOpen, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: ''
    },
    academicInfo: {
      institution: '',
      program: '',
      year: '',
      gpa: '',
      expectedGraduation: ''
    },
    applicationDetails: {
      requestedAmount: '',
      purpose: '',
      timeline: '',
      additionalInfo: ''
    },
    documents: {
      transcript: null,
      essay: null,
      recommendation: null
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setTimeout(() => {
        onSubmit(formData)
        onClose()
        setSubmitSuccess(false)
        setCurrentStep(1)
      }, 2000)
    }, 3000)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.personalInfo.fullName}
            onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.personalInfo.address}
          onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
          placeholder="Enter your full address"
          rows={3}
        />
      </div>
    </motion.div>
  )

  const renderAcademicInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="institution">Institution *</Label>
          <Input
            id="institution"
            value={formData.academicInfo.institution}
            onChange={(e) => handleInputChange('academicInfo', 'institution', e.target.value)}
            placeholder="Enter your institution name"
          />
        </div>
        <div>
          <Label htmlFor="program">Program/Major *</Label>
          <Input
            id="program"
            value={formData.academicInfo.program}
            onChange={(e) => handleInputChange('academicInfo', 'program', e.target.value)}
            placeholder="Enter your program or major"
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="year">Academic Year</Label>
          <Select onValueChange={(value) => handleInputChange('academicInfo', 'year', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freshman">Freshman</SelectItem>
              <SelectItem value="sophomore">Sophomore</SelectItem>
              <SelectItem value="junior">Junior</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="graduate">Graduate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gpa">GPA</Label>
          <Input
            id="gpa"
            value={formData.academicInfo.gpa}
            onChange={(e) => handleInputChange('academicInfo', 'gpa', e.target.value)}
            placeholder="e.g., 3.75"
          />
        </div>
        <div>
          <Label htmlFor="expectedGraduation">Expected Graduation</Label>
          <Input
            id="expectedGraduation"
            type="date"
            value={formData.academicInfo.expectedGraduation}
            onChange={(e) => handleInputChange('academicInfo', 'expectedGraduation', e.target.value)}
          />
        </div>
      </div>
    </motion.div>
  )

  const renderApplicationDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="requestedAmount">Requested Amount *</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="requestedAmount"
            type="number"
            value={formData.applicationDetails.requestedAmount}
            onChange={(e) => handleInputChange('applicationDetails', 'requestedAmount', e.target.value)}
            placeholder="0.00"
            className="pl-10"
            max={grant?.maxPerStudent}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Maximum allowed: {formatCurrency(grant?.maxPerStudent || 0)}
        </p>
      </div>
      <div>
        <Label htmlFor="purpose">Purpose of Grant *</Label>
        <Textarea
          id="purpose"
          value={formData.applicationDetails.purpose}
          onChange={(e) => handleInputChange('applicationDetails', 'purpose', e.target.value)}
          placeholder="Explain how you plan to use the grant funds..."
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="timeline">Project Timeline</Label>
        <Textarea
          id="timeline"
          value={formData.applicationDetails.timeline}
          onChange={(e) => handleInputChange('applicationDetails', 'timeline', e.target.value)}
          placeholder="Describe your project timeline and milestones..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          value={formData.applicationDetails.additionalInfo}
          onChange={(e) => handleInputChange('applicationDetails', 'additionalInfo', e.target.value)}
          placeholder="Any additional information you'd like to share..."
          rows={3}
        />
      </div>
    </motion.div>
  )

  const renderDocuments = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <div className="mt-4">
              <Label htmlFor="transcript" className="cursor-pointer">
                <span className="text-sm font-medium">Academic Transcript *</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your official academic transcript (PDF, max 5MB)
                </p>
              </Label>
              <Input
                id="transcript"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload('transcript', e.target.files[0])}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <div className="mt-4">
              <Label htmlFor="essay" className="cursor-pointer">
                <span className="text-sm font-medium">Personal Essay *</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your personal statement or essay (PDF, max 5MB)
                </p>
              </Label>
              <Input
                id="essay"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload('essay', e.target.files[0])}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <div className="mt-4">
              <Label htmlFor="recommendation" className="cursor-pointer">
                <span className="text-sm font-medium">Letter of Recommendation</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a letter of recommendation (PDF, max 5MB) - Optional
                </p>
              </Label>
              <Input
                id="recommendation"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload('recommendation', e.target.files[0])}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo()
      case 2:
        return renderAcademicInfo()
      case 3:
        return renderApplicationDetails()
      case 4:
        return renderDocuments()
      default:
        return null
    }
  }

  const stepTitles = [
    'Personal Information',
    'Academic Information',
    'Application Details',
    'Documents'
  ]

  if (submitSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-8 w-8 text-green-500" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your grant application has been successfully submitted. You'll receive a confirmation email shortly.
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Application ID: #GA{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Badge>
          </motion.div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Apply for {grant?.title}
          </DialogTitle>
          <DialogDescription>
            Complete all steps to submit your grant application
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-6">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < stepTitles.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > index + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {currentStep > index + 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-xs font-medium ${
                  currentStep >= index + 1 ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {title}
                </p>
              </div>
              {index < stepTitles.length - 1 && (
                <div className={`flex-1 h-px mx-4 ${
                  currentStep > index + 1 ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

