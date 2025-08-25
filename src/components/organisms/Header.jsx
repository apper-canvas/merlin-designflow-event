import { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { motion } from "framer-motion"

const Header = ({ onMenuToggle, title }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-100 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-display font-semibold text-primary">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-accent text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-premium border border-gray-100 p-4 z-50"
              >
                <h3 className="font-semibold text-primary mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800">Project Update</p>
                    <p className="text-xs text-blue-600">Modern Loft - Client approved mood board</p>
                  </div>
                  <div className="p-3 rounded-lg bg-yellow-50 border-l-4 border-yellow-400">
                    <p className="text-sm font-medium text-yellow-800">Payment Due</p>
                    <p className="text-xs text-yellow-600">Coastal Villa - 2nd milestone payment</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-400">
                    <p className="text-sm font-medium text-green-800">Task Complete</p>
                    <p className="text-xs text-green-600">Urban Studio - Floor plan delivered</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <Button variant="accent" size="sm">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header