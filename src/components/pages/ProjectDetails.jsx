import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { toast } from "react-toastify"
import { format } from "date-fns"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadProject = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await projectService.getById(parseInt(id))
      setProject(data)
    } catch (err) {
      setError("Failed to load project")
      toast.error("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProject()
    }
  }, [id])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "success"
      case "planning": return "info"
      case "execution": return "accent"
      case "completed": return "success"
      case "on hold": return "warning"
      default: return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low": return "default"
      case "medium": return "warning"
      case "high": return "error"
      default: return "default"
    }
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadProject}
    />
  )

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">Project not found</h2>
        <Button 
          variant="outline"
          onClick={() => navigate("/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <Button 
            variant="ghost"
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 mb-4 p-0"
          >
            <ApperIcon name="ArrowLeft" className="h-4 w-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            {project.name}
          </h1>
          <p className="text-gray-600">
            {project.description || "No description provided"}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={getStatusColor(project.status)}>
            {project.status}
          </Badge>
          <Badge variant={getPriorityColor(project.priority)}>
            {project.priority} priority
          </Badge>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-premium border border-gray-100"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Client Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ApperIcon name="User" className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{project.client}</span>
                </div>
                {project.location && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="MapPin" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{project.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Project Details</h3>
              <div className="space-y-2">
                {project.style && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Palette" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{project.style}</span>
                  </div>
                )}
                {project.rooms && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Home" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{project.rooms} rooms</span>
                  </div>
                )}
                {project.budget > 0 && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="DollarSign" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">${project.budget.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Timeline</h3>
              <div className="space-y-2">
                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Started: {format(new Date(project.startDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Due: {format(new Date(project.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ApperIcon name="TrendingUp" className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{project.progress || 0}% complete</span>
                </div>
              </div>
            </div>
          </div>

          {project.progress !== undefined && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-primary mb-3">Progress</h3>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress || 0}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {project.progress || 0}% completed
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectDetails