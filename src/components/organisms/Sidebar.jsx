import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const Sidebar = ({ isOpen, onClose, className = "" }) => {
const navItems = [
    { name: "Dashboard", path: "/", icon: "Home" },
    { name: "Projects", path: "/projects", icon: "FolderOpen" },
    { name: "Leads", path: "/leads", icon: "Users" },
    { name: "Clients", path: "/clients", icon: "UserCheck" },
    { name: "Vendors", path: "/vendors", icon: "Building2" },
    { name: "Finances", path: "/finances", icon: "DollarSign" },
    { name: "Purchase Orders", path: "/purchase-orders", icon: "ShoppingCart" },
    { name: "Tasks", path: "/tasks", icon: "CheckSquare" },
    { name: "Settings", path: "/settings", icon: "Settings" },
  ]

  // Desktop Sidebar - Static
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-gradient-primary text-white h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-lg bg-gradient-accent flex items-center justify-center">
            <ApperIcon name="Palette" className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold">DesignFlow</h1>
            <p className="text-sm text-gray-300">Pro</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white border-l-4 border-accent"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <ApperIcon name={item.icon} className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )

  // Mobile Sidebar - Overlay with transform
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 h-full w-64 bg-gradient-primary text-white z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-accent flex items-center justify-center">
                <ApperIcon name="Palette" className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold">DesignFlow</h1>
                <p className="text-sm text-gray-300">Pro</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white border-l-4 border-accent"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <ApperIcon name={item.icon} className="h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar