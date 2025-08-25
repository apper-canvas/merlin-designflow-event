import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TaskBoard from "@/components/organisms/TaskBoard"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import StatCard from "@/components/molecules/StatCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { taskService } from "@/services/api/taskService"
import { projectService } from "@/services/api/projectService"
import { toast } from "react-toastify"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedProject, setSelectedProject] = useState("all")
  const [viewMode, setViewMode] = useState("board")

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ])
      setTasks(tasksData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load tasks")
      toast.error("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await taskService.update(updatedTask.Id, updatedTask)
      setTasks(prev => prev.map(task => 
        task.Id === updatedTask.Id ? updatedTask : task
      ))
      toast.success("Task updated successfully!")
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadTasks}
    />
  )

  const filteredTasks = selectedProject === "all" 
    ? tasks 
    : tasks.filter(task => task.projectId === selectedProject)

  const taskStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === "todo").length,
    inProgress: filteredTasks.filter(t => t.status === "in-progress").length,
    completed: filteredTasks.filter(t => t.status === "done").length
  }

  const completionRate = taskStats.total > 0 
    ? ((taskStats.completed / taskStats.total) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Tasks
          </h1>
          <p className="text-gray-600">
            Manage project tasks and track progress across all projects.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-48"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.Id} value={project.Id}>
                {project.name}
              </option>
            ))}
          </Select>
          
          <Select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="w-32"
          >
            <option value="board">Board View</option>
            <option value="list">List View</option>
          </Select>
          
          <Button variant="accent" className="flex items-center gap-2">
            <ApperIcon name="Plus" className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </motion.div>

      {/* Task Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          icon="CheckSquare"
        />
        <StatCard
          title="To Do"
          value={taskStats.todo}
          icon="Circle"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress}
          icon="Clock"
        />
        <StatCard
          title="Completed"
          value={taskStats.completed}
          change={`${completionRate}% complete`}
          icon="CheckCircle"
          trend="up"
        />
      </motion.div>

      {/* Task Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredTasks.length === 0 ? (
          <Empty
            title="No tasks found"
            description={selectedProject !== "all" 
              ? "This project doesn't have any tasks yet" 
              : "Start by creating your first task"
            }
            icon="CheckSquare"
            actionLabel="Create Task"
          />
        ) : (
          <TaskBoard 
            tasks={filteredTasks} 
            onTaskUpdate={handleTaskUpdate}
          />
        )}
      </motion.div>
    </div>
  )
}

export default Tasks