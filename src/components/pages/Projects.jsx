import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ProjectCard from "@/components/organisms/ProjectCard"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { projectService } from "@/services/api/projectService"
import { toast } from "react-toastify"

const Projects = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await projectService.getAll()
      setProjects(data)
      setFilteredProjects(data)
    } catch (err) {
      setError("Failed to load projects")
      toast.error("Failed to load projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(project => 
        project.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    setFilteredProjects(filtered)
  }, [projects, searchQuery, statusFilter])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadProjects}
    />
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Projects
          </h1>
          <p className="text-gray-600">
            Manage your interior design projects from concept to completion.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search projects..."
          onSearch={handleSearch}
          className="flex-1"
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Projects</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="execution">Execution</option>
          <option value="completed">Completed</option>
          <option value="on hold">On Hold</option>
        </Select>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredProjects.length === 0 ? (
          <Empty
            title={searchQuery || statusFilter !== "all" ? "No projects match your filters" : "No projects yet"}
            description={searchQuery || statusFilter !== "all" ? "Try adjusting your search or filter criteria" : "Start by creating your first design project"}
            icon="FolderOpen"
            actionLabel="Create Project"
            onAction={() => navigate("/projects/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.Id}
                project={project}
                onClick={() => navigate(`/projects/${project.Id}`)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Projects