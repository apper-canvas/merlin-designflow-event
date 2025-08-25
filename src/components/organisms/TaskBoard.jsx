import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"
import { format } from "date-fns"

const TaskBoard = ({ tasks = [], onTaskUpdate }) => {
  const [draggedTask, setDraggedTask] = useState(null)
  
  const columns = [
    { id: "todo", title: "To Do", tasks: tasks.filter(t => t.status === "todo") },
    { id: "in-progress", title: "In Progress", tasks: tasks.filter(t => t.status === "in-progress") },
    { id: "review", title: "Review", tasks: tasks.filter(t => t.status === "review") },
    { id: "done", title: "Done", tasks: tasks.filter(t => t.status === "done") },
  ]

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error"
      case "medium": return "warning" 
      case "low": return "success"
      default: return "default"
    }
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, columnId) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== columnId) {
      onTaskUpdate({ ...draggedTask, status: columnId })
    }
    setDraggedTask(null)
  }

  const TaskCard = ({ task }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileDrag={{ scale: 1.05, rotate: 3 }}
    >
      <Card 
        className="mb-3 cursor-move hover:shadow-md transition-all duration-200"
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-primary text-sm">{task.title}</h4>
            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
              {task.priority}
            </Badge>
          </div>
          
          {task.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
          )}
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="User" className="h-3 w-3" />
              <span>{task.assignee}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "MMM dd")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <Card key={column.id} className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{column.title}</span>
              <Badge variant="outline" className="text-xs">
                {column.tasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent 
            className="p-3 pt-0 min-h-[200px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {column.tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <ApperIcon name="Plus" className="h-6 w-6 mb-2" />
                <p className="text-sm">Drop tasks here</p>
              </div>
            ) : (
              column.tasks.map((task) => (
                <TaskCard key={task.Id} task={task} />
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default TaskBoard