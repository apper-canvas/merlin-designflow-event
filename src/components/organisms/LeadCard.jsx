import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

const LeadCard = ({ lead, onConvert, onUpdate }) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error"
      case "medium": return "warning"
      case "low": return "success"
      default: return "default"
    }
  }

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-premium transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-primary mb-1">{lead.name}</h3>
              <p className="text-sm text-gray-600">{lead.email}</p>
            </div>
            <Badge variant={getPriorityColor(lead.priority)}>
              {lead.priority}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Home" className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{lead.projectType}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="DollarSign" className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{lead.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {formatDistanceToNow(new Date(lead.createdAt))} ago
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="accent" 
              size="sm" 
              className="flex-1"
              onClick={() => onConvert(lead)}
            >
              <ApperIcon name="ArrowRight" className="h-4 w-4 mr-1" />
              Convert
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdate(lead)}
            >
              <ApperIcon name="Edit" className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default LeadCard