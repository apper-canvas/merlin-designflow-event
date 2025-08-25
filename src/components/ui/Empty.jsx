import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No items found", 
  description = "Get started by creating your first item",
  icon = "Package",
  actionLabel = "Create New",
  onAction,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-xl font-semibold text-primary mb-2">
          {title}
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {description}
        </p>
      </motion.div>

      {onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={onAction}
            variant="accent"
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Empty