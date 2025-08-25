import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { clientService } from "@/services/api/clientService"
import { toast } from "react-toastify"

const ProjectNew = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [clientsLoading, setClientsLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    client: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "planning",
    priority: "medium",
    location: "",
    style: "",
    rooms: ""
  })

  const loadClients = async () => {
    try {
      setClientsLoading(true)
      const data = await clientService.getAll()
      setClients(data)
    } catch (err) {
      setError("Failed to load clients")
      toast.error("Failed to load clients")
    } finally {
      setClientsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error("Project name is required")
      return
    }
    
    if (!formData.client) {
      toast.error("Please select a client")
      return
    }

    try {
      setLoading(true)
      const projectData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        progress: 0
      }
      
      await projectService.create(projectData)
      toast.success("Project created successfully!")
      navigate("/projects")
    } catch (err) {
      toast.error("Failed to create project")
      console.error("Project creation error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (clientsLoading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadClients}
    />
  )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Create New Project
          </h1>
          <p className="text-gray-600">
            Set up a new interior design project and define its scope.
          </p>
        </div>
        
        <Button 
          variant="outline"
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4" />
          Back to Projects
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-premium border border-gray-100"
      >
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary border-b border-gray-100 pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Project Name" required>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Modern Loft Renovation"
                    required
                  />
                </FormField>

                <FormField label="Client" required>
                  <Select
                    value={formData.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.Id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <FormField label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the project scope, goals, and key requirements..."
                  rows={3}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Budget">
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </FormField>

                <FormField label="Status">
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="execution">Execution</option>
                    <option value="completed">Completed</option>
                    <option value="on hold">On Hold</option>
                  </Select>
                </FormField>

                <FormField label="Priority">
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary border-b border-gray-100 pb-2">
                Timeline
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Start Date">
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </FormField>

                <FormField label="Expected End Date">
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </FormField>
              </div>
            </div>

            {/* Project Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary border-b border-gray-100 pb-2">
                Project Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Location">
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., New York, NY"
                  />
                </FormField>

                <FormField label="Design Style">
                  <Select
                    value={formData.style}
                    onChange={(e) => handleInputChange("style", e.target.value)}
                  >
                    <option value="">Select Style</option>
                    <option value="modern">Modern</option>
                    <option value="contemporary">Contemporary</option>
                    <option value="traditional">Traditional</option>
                    <option value="transitional">Transitional</option>
                    <option value="industrial">Industrial</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="scandinavian">Scandinavian</option>
                    <option value="bohemian">Bohemian</option>
                    <option value="rustic">Rustic</option>
                    <option value="eclectic">Eclectic</option>
                  </Select>
                </FormField>

                <FormField label="Number of Rooms">
                  <Input
                    type="number"
                    value={formData.rooms}
                    onChange={(e) => handleInputChange("rooms", e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </FormField>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/projects")}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" className="h-4 w-4" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectNew