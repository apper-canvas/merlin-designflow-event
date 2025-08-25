import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import StatusChip from "@/components/molecules/StatusChip"
import ProgressRing from "@/components/molecules/ProgressRing"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const ProjectCard = ({ project, onClick }) => {
  const budgetUsed = (project.spent / project.budget) * 100
  const daysRemaining = Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="cursor-pointer hover:shadow-premium transition-all duration-200" onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-primary text-lg mb-1">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.client}</p>
            </div>
            <StatusChip status={project.status} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Budget Progress</p>
              <div className="flex items-center gap-3">
                <ProgressRing 
                  progress={budgetUsed} 
                  size={40} 
                  strokeWidth={4}
                  showPercentage={false}
                />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    ${project.spent.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    of ${project.budget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 mb-1">Timeline</p>
              <div className="flex items-center gap-2">
                <ApperIcon name="Calendar" className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {daysRemaining > 0 ? `${daysRemaining} days` : "Overdue"}
                  </p>
                  <p className="text-xs text-gray-500">remaining</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{project.location}</span>
            </div>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProjectCard