import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { financeService } from "@/services/api/financeService";
import { projectService } from "@/services/api/projectService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import InvoiceModal from "@/components/organisms/InvoiceModal";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/molecules/ProgressRing";
import StatCard from "@/components/molecules/StatCard";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Finances = () => {
  const [finances, setFinances] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const loadFinances = async () => {
    try {
      setLoading(true)
      setError("")
      const [financesData, projectsData] = await Promise.all([
        financeService.getAll(),
        projectService.getAll()
      ])
      setFinances(financesData)
      setProjects(projectsData)
    } catch (err) {
      setError("Failed to load financial data")
      toast.error("Failed to load financial data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFinances()
  }, [])

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadFinances}
    />
  )

  // Calculate financial metrics
  const totalRevenue = finances
    .filter(f => f.type === "income")
    .reduce((sum, f) => sum + f.amount, 0)

  const totalExpenses = finances
    .filter(f => f.type === "expense")
    .reduce((sum, f) => sum + f.amount, 0)

  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

  const pendingInvoices = finances.filter(f => f.status === "pending")
  const overdueInvoices = finances.filter(f => 
    f.status === "pending" && new Date(f.dueDate) < new Date()
  )

  const recentTransactions = finances
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "success"
      case "pending": return "warning"
      case "overdue": return "error"
      default: return "default"
    }
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "income": return "TrendingUp"
      case "expense": return "TrendingDown"
      default: return "DollarSign"
}
  }

  const handleNewInvoice = () => {
    setShowInvoiceModal(true)
  }

  const handleInvoiceSuccess = () => {
    loadFinances()
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Finances
          </h1>
          <p className="text-gray-600">
            Track project finances, invoices, and profitability.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-32"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </Select>
          
<Button 
            variant="accent" 
            className="flex items-center gap-2"
            onClick={handleNewInvoice}
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </motion.div>

      {/* Financial Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change="+12% from last month"
          icon="TrendingUp"
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={`$${(totalExpenses / 1000).toFixed(0)}K`}
          change="+5% from last month"
          icon="TrendingDown"
          trend="up"
        />
        <StatCard
          title="Net Profit"
          value={`$${(netProfit / 1000).toFixed(0)}K`}
          change={`${profitMargin.toFixed(1)}% margin`}
          icon="DollarSign"
          trend={netProfit > 0 ? "up" : "down"}
        />
        <StatCard
          title="Pending Invoices"
          value={pendingInvoices.length}
          change={`${overdueInvoices.length} overdue`}
          icon="FileText"
          trend={overdueInvoices.length > 0 ? "down" : "up"}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                  <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <Empty
                  title="No transactions yet"
                  description="Financial transactions will appear here"
                  icon="DollarSign"
                />
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div 
                      key={transaction.Id}
                      className="flex items-center justify-between p-4 rounded-lg bg-surface hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" 
                            ? "bg-green-100" 
                            : "bg-red-100"
                        }`}>
                          <ApperIcon 
                            name={getTypeIcon(transaction.type)}
                            className={`h-5 w-5 ${
                              transaction.type === "income" 
                                ? "text-green-600" 
                                : "text-red-600"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-primary">{transaction.description}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(transaction.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === "income" 
                            ? "text-success" 
                            : "text-red-600"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}
                          ${transaction.amount.toLocaleString()}
                        </p>
                        <Badge variant={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Profit Margin */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ProgressRing 
                progress={Math.max(0, profitMargin)} 
                size={120}
                label="Profit Margin"
              />
            </CardContent>
          </Card>

          {/* Outstanding Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <span className="font-semibold text-primary">
                    ${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                  </span>
                </div>
                
                {overdueInvoices.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="AlertTriangle" className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Overdue</span>
                    </div>
                    <span className="font-semibold text-red-600">
                      ${overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Calculator" className="h-4 w-4 mr-2" />
                Project Budget
              </Button>
            </CardContent>
          </Card>
        </motion.div>
</div>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSuccess={handleInvoiceSuccess}
      />
    </div>
  )
}

export default Finances