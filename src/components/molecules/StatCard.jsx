import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "up",
  className = "" 
}) => {
  return (
    <Card className={`hover:shadow-premium transition-all duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-gradient">{value}</h3>
              {change && (
                <span className={`text-sm font-medium ${trend === "up" ? "text-success" : "text-red-500"}`}>
                  {change}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className="h-12 w-12 rounded-lg bg-gradient-accent flex items-center justify-center">
              <ApperIcon name={icon} className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard