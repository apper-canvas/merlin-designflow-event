import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-6"
      >
        <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-10 w-10 text-red-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <h3 className="text-xl font-semibold text-primary mb-2">
          Oops! Something went wrong
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {message}
        </p>
      </motion.div>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={onRetry}
            variant="accent"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Error