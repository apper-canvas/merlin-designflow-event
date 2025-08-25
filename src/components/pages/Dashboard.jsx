import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import StatCard from "@/components/molecules/StatCard"
import ProjectCard from "@/components/organisms/ProjectCard"
import TaskBoard from "@/components/organisms/TaskBoard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { projectService } from "@/services/api/projectService"
import { leadService } from "@/services/api/leadService"
import { taskService } from "@/services/api/taskService"
import { toast } from "react-toastify"

const Dashboard = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [leads, setLeads] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [projectsData, leadsData, tasksData] = await Promise.all([
        projectService.getAll(),
        leadService.getAll(), 
        taskService.getAll()
      ])
      
      setProjects(projectsData)
      setLeads(leadsData)
      setTasks(tasksData)
    } catch (err) {
      setError("Failed to load dashboard data")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
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
      onRetry={loadDashboardData}
    />
  )

  const stats = {
    activeProjects: projects.filter(p => p.status === "Active").length,
    totalRevenue: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    pendingLeads: leads.filter(l => l.status === "New").length,
    completedTasks: tasks.filter(t => t.status === "done").length
  }

  const recentProjects = projects
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 6)

  const upcomingTasks = tasks
    .filter(t => t.status !== "done")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => navigate("/projects/new")}
          className="hidden sm:flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          New Project
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          change="+12% from last month"
          icon="FolderOpen"
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          change="+8% from last month"
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Pending Leads"
          value={stats.pendingLeads}
          change="5 new this week"
          icon="Users"
          trend="up"
        />
        <StatCard
          title="Tasks Complete"
          value={stats.completedTasks}
          change="+15% this week"
          icon="CheckSquare"
          trend="up"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/projects")}
                >
                  View All
                  <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <Empty
                  title="No projects yet"
                  description="Start by creating your first design project"
                  icon="FolderOpen"
                  actionLabel="Create Project"
                  onAction={() => navigate("/projects/new")}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentProjects.map((project) => (
                    <ProjectCard
                      key={project.Id}
                      project={project}
                      onClick={() => navigate(`/projects/${project.Id}`)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions & Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/leads/new")}
              >
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/projects/new")}
              >
                <ApperIcon name="FolderPlus" className="h-4 w-4 mr-2" />
                Create Project
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/tasks/new")}
              >
                <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate("/finances")}
              >
                <ApperIcon name="Calculator" className="h-4 w-4 mr-2" />
                View Finances
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <ApperIcon name="CheckSquare" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No upcoming tasks</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div 
                      key={task.Id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-primary">{task.title}</p>
                        <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Task Board Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Task Board</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/tasks")}
              >
                View Full Board
                <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <Empty
                title="No tasks yet"
                description="Create tasks to track project progress"
                icon="CheckSquare"
                actionLabel="Add Task"
                onAction={() => navigate("/tasks/new")}
              />
            ) : (
              <TaskBoard 
                tasks={tasks.slice(0, 12)} 
                onTaskUpdate={handleTaskUpdate}
              />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Dashboard