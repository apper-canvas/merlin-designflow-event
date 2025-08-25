import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { leadService } from "@/services/api/leadService"
import { toast } from "react-toastify"

const LeadNew = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Kitchen Remodel",
    budget: "",
    priority: "Medium",
    status: "New",
    notes: ""
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors and try again")
      return
    }

    try {
      setLoading(true)
      await leadService.create({
        ...formData,
        createdAt: new Date().toISOString()
      })
      
      toast.success("Lead created successfully!")
      navigate("/leads")
    } catch (error) {
      toast.error("Failed to create lead. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const projectTypes = [
    "Kitchen Remodel",
    "Bathroom Renovation",
    "Living Room Redesign",
    "Bedroom Makeover",
    "Office Design",
    "Whole House",
    "Outdoor Space",
    "Commercial"
  ]

  const budgetRanges = [
    "$5,000 - $15,000",
    "$15,000 - $30,000",
    "$30,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+"
  ]

  const priorities = ["Low", "Medium", "High"]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            New Lead
          </h1>
          <p className="text-gray-600">
            Add a new potential client to your lead pipeline.
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to Leads
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ApperIcon name="UserPlus" className="h-5 w-5" />
              Lead Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<FormField label="Full Name" required error={errors.name}>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter client's full name"
                    error={!!errors.name}
                  />
                </FormField>

<FormField label="Email Address" required error={errors.email}>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="client@example.com"
                    error={!!errors.email}
                  />
                </FormField>

<FormField label="Phone Number" required error={errors.phone}>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    error={!!errors.phone}
                  />
                </FormField>

                <FormField label="Project Type" required>
                  <Select
                    value={formData.projectType}
                    onChange={(e) => handleChange('projectType', e.target.value)}
                  >
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </FormField>

<FormField label="Budget Range" required error={errors.budget}>
                  <Select
                    value={formData.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    error={!!errors.budget}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Priority" required>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Notes" description="Additional information about the lead">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional notes about this lead..."
                  rows={4}
                />
              </FormField>

              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  variant="accent"
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                      Creating Lead...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Plus" className="h-4 w-4" />
                      Create Lead
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/leads")}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default LeadNew