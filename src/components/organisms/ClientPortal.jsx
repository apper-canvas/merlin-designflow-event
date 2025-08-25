import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

const ClientPortal = ({ project, onApproval, onFeedback }) => {
  const [activeTab, setActiveTab] = useState("designs")
  const [comment, setComment] = useState("")
  const [selectedDesign, setSelectedDesign] = useState(null)

  const tabs = [
    { id: "designs", label: "Designs", icon: "Palette" },
    { id: "timeline", label: "Timeline", icon: "Calendar" },
    { id: "budget", label: "Budget", icon: "DollarSign" },
    { id: "documents", label: "Documents", icon: "FileText" },
  ]

  const handleApprove = (item) => {
    onApproval(item, "approved")
    toast.success("Design approved successfully!")
  }

  const handleRequestChanges = (item) => {
    if (!comment.trim()) {
      toast.error("Please provide feedback for requested changes")
      return
    }
    onFeedback(item, comment, "changes-requested")
    setComment("")
    toast.info("Changes requested - designer will be notified")
  }

  const DesignGallery = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {project.designs?.map((design) => (
        <motion.div
          key={design.Id}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ApperIcon name="Image" className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute top-3 right-3">
                <Badge variant={design.status === "approved" ? "success" : "warning"}>
                  {design.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-primary mb-2">{design.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{design.description}</p>
              
              <div className="flex gap-2">
                <Button 
                  variant="accent" 
                  size="sm"
                  onClick={() => handleApprove(design)}
                  disabled={design.status === "approved"}
                >
                  <ApperIcon name="Check" className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedDesign(design)}
                >
                  <ApperIcon name="MessageCircle" className="h-4 w-4 mr-1" />
                  Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const ProjectTimeline = () => (
    <div className="space-y-4">
      {project.milestones?.map((milestone, index) => (
        <div key={milestone.Id} className="flex items-start gap-4">
          <div className={`mt-2 h-3 w-3 rounded-full ${
            milestone.completed ? "bg-success" : "bg-gray-300"
          }`} />
          <div className="flex-1">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary">{milestone.title}</h3>
                  <Badge variant={milestone.completed ? "success" : "warning"}>
                    {milestone.completed ? "Complete" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Due: {milestone.dueDate}</span>
                  {milestone.completed && <span>Completed: {milestone.completedDate}</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ))}
    </div>
  )

  const BudgetBreakdown = () => (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-surface rounded-lg">
            <span className="font-medium">Total Budget</span>
            <span className="text-xl font-bold text-gradient">
              ${project.budget?.toLocaleString()}
            </span>
          </div>
          
          {project.budgetItems?.map((item) => (
            <div key={item.Id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-primary">{item.category}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <span className="font-semibold text-primary">
                ${item.amount?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">
          {project.name}
        </h1>
        <p className="text-gray-600">Welcome to your project portal</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-accent text-accent"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name={tab.icon} className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mb-8">
        {activeTab === "designs" && <DesignGallery />}
        {activeTab === "timeline" && <ProjectTimeline />}
        {activeTab === "budget" && <BudgetBreakdown />}
        {activeTab === "documents" && (
          <div className="text-center py-12">
            <ApperIcon name="FileText" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">Documents</h3>
            <p className="text-gray-600">Project documents will appear here</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {selectedDesign && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDesign(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-primary mb-4">
              Provide Feedback: {selectedDesign.name}
            </h3>
            
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please describe the changes you'd like to see..."
              className="mb-4"
              rows={4}
            />
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setSelectedDesign(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="accent"
                onClick={() => {
                  handleRequestChanges(selectedDesign)
                  setSelectedDesign(null)
                }}
              >
                Request Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default ClientPortal