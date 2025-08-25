import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import Badge from "@/components/atoms/Badge"
import StatCard from "@/components/molecules/StatCard"
import FormField from "@/components/molecules/FormField"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { purchaseOrderService } from "@/services/api/purchaseOrderService"
import { vendorService } from "@/services/api/vendorService"
import { toast } from "react-toastify"
import { format } from "date-fns"

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [formData, setFormData] = useState({
    vendorId: "",
    title: "",
    description: "",
    priority: "medium",
    expectedDelivery: "",
    shippingAddress: "",
    lineItems: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [ordersData, vendorsData] = await Promise.all([
        purchaseOrderService.getAll(),
        vendorService.getAll()
      ])
      setPurchaseOrders(ordersData)
      setVendors(vendorsData)
    } catch (err) {
      setError("Failed to load purchase orders")
      toast.error("Failed to load purchase orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "draft": return "default"
      case "pending": return "warning"
      case "approved": return "info"
      case "ordered": return "accent"
      case "delivered": return "success"
      case "cancelled": return "error"
      default: return "default"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "low": return "default"
      case "medium": return "warning"
      case "high": return "error"
      default: return "default"
    }
  }

  const calculateLineItemTotal = (quantity, unitPrice) => {
    return quantity * unitPrice
  }

  const calculateOrderTotal = (lineItems) => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
  }

  const updateLineItem = (index, field, value) => {
    const updatedItems = [...formData.lineItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = calculateLineItemTotal(
        updatedItems[index].quantity, 
        updatedItems[index].unitPrice
      )
    }
    
    setFormData({ ...formData, lineItems: updatedItems })
  }

  const addLineItem = () => {
    setFormData({
      ...formData,
      lineItems: [...formData.lineItems, { description: "", quantity: 1, unitPrice: 0, total: 0 }]
    })
  }

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      const updatedItems = formData.lineItems.filter((_, i) => i !== index)
      setFormData({ ...formData, lineItems: updatedItems })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingOrder) {
        await purchaseOrderService.update(editingOrder.Id, {
          ...formData,
          totalAmount: calculateOrderTotal(formData.lineItems)
        })
        toast.success("Purchase order updated successfully")
      } else {
        await purchaseOrderService.create({
          ...formData,
          totalAmount: calculateOrderTotal(formData.lineItems)
        })
        toast.success("Purchase order created successfully")
      }
      setShowModal(false)
      resetForm()
      loadData()
    } catch (err) {
      toast.error(editingOrder ? "Failed to update purchase order" : "Failed to create purchase order")
    }
  }

  const handleApprove = async (order) => {
    try {
      await purchaseOrderService.updateStatus(order.Id, "approved")
      toast.success("Purchase order approved")
      loadData()
    } catch (err) {
      toast.error("Failed to approve purchase order")
    }
  }

  const handleSubmitForApproval = async (order) => {
    try {
      await purchaseOrderService.updateStatus(order.Id, "pending")
      toast.success("Purchase order submitted for approval")
      loadData()
    } catch (err) {
      toast.error("Failed to submit purchase order")
    }
  }

  const handleSendOrder = async (order) => {
    try {
      await purchaseOrderService.updateStatus(order.Id, "ordered")
      toast.success("Purchase order sent to vendor")
      loadData()
    } catch (err) {
      toast.error("Failed to send purchase order")
    }
  }

  const handleDelete = async (order) => {
    if (window.confirm("Are you sure you want to delete this purchase order?")) {
      try {
        await purchaseOrderService.delete(order.Id)
        toast.success("Purchase order deleted successfully")
        loadData()
      } catch (err) {
        toast.error("Failed to delete purchase order")
      }
    }
  }

  const openEditModal = (order) => {
    setEditingOrder(order)
    setFormData({
      vendorId: order.vendorId.toString(),
      title: order.title,
      description: order.description,
      priority: order.priority,
      expectedDelivery: order.expectedDelivery.split("T")[0],
      shippingAddress: order.shippingAddress,
      lineItems: order.lineItems || [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]
    })
    setShowModal(true)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingOrder(null)
    setFormData({
      vendorId: "",
      title: "",
      description: "",
      priority: "medium",
      expectedDelivery: "",
      shippingAddress: "",
      lineItems: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }]
    })
  }

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.Id === vendorId)
    return vendor ? vendor.name : "Unknown Vendor"
  }

  // Calculate statistics
  const totalOrders = purchaseOrders.length
  const pendingOrders = purchaseOrders.filter(o => o.status === "pending").length
  const approvedOrders = purchaseOrders.filter(o => o.status === "approved").length
  const totalValue = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0)

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadData}
    />
  )

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Purchase Orders
          </h1>
          <p className="text-gray-600">
            Manage purchase orders, track approvals, and monitor deliveries.
          </p>
        </div>
        
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="h-4 w-4" />
          New Purchase Order
        </Button>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon="ShoppingCart"
          trend="up"
        />
        <StatCard
          title="Pending Approval"
          value={pendingOrders}
          icon="Clock"
          trend={pendingOrders > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="Approved Orders"
          value={approvedOrders}
          icon="CheckCircle"
          trend="up"
        />
        <StatCard
          title="Total Value"
          value={`$${(totalValue / 1000).toFixed(0)}K`}
          icon="DollarSign"
          trend="up"
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search purchase orders..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="ordered">Ordered</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </motion.div>

      {/* Purchase Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredOrders.length === 0 ? (
          <Empty
            title="No purchase orders found"
            description="Create your first purchase order to get started"
            icon="ShoppingCart"
            action={
              <Button onClick={openCreateModal}>
                Create Purchase Order
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.Id} className="hover:shadow-premium transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-primary text-lg">{order.title}</h3>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <Badge variant={getPriorityColor(order.priority)}>
                          {order.priority} priority
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{order.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Building2" className="h-4 w-4" />
                          {getVendorName(order.vendorId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="h-4 w-4" />
                          Expected: {format(new Date(order.expectedDelivery), "MMM dd, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="DollarSign" className="h-4 w-4" />
                          ${order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {order.status === "draft" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubmitForApproval(order)}
                        >
                          Submit for Approval
                        </Button>
                      )}
                      {order.status === "pending" && (
                        <Button
                          variant="accent"
                          size="sm"
                          onClick={() => handleApprove(order)}
                        >
                          Approve
                        </Button>
                      )}
                      {order.status === "approved" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSendOrder(order)}
                        >
                          Send Order
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(order)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </Button>
                      {order.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order)}
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {order.lineItems && order.lineItems.length > 0 && (
                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Line Items:</h4>
                      <div className="space-y-2">
                        {order.lineItems.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.description} (x{item.quantity})
                            </span>
                            <span className="font-medium">
                              ${(item.quantity * item.unitPrice).toLocaleString()}
                            </span>
                          </div>
                        ))}
                        {order.lineItems.length > 3 && (
                          <p className="text-sm text-gray-500">
                            +{order.lineItems.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">
                {editingOrder ? "Edit Purchase Order" : "Create Purchase Order"}
              </h2>
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Vendor" required>
                  <Select
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    required
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.Id} value={vendor.Id}>
                        {vendor.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Priority">
                  <Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>
              </div>

              <FormField label="Title" required>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Purchase order title"
                  required
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional details about this purchase order"
                  rows={3}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Expected Delivery" required>
                  <Input
                    type="date"
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    required
                  />
                </FormField>

                <FormField label="Shipping Address">
                  <Input
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                    placeholder="Delivery address"
                  />
                </FormField>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-primary">Line Items</h3>
                  <Button type="button" variant="outline" onClick={addLineItem}>
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="col-span-12 md:col-span-5">
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(index, "description", e.target.value)}
                          placeholder="Item description"
                          required
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, "quantity", parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                          min="1"
                          required
                        />
                      </div>
                      <div className="col-span-4 md:col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                          placeholder="Price"
                          min="0"
                          required
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2 flex items-center">
                        <span className="text-sm font-medium">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {formData.lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-right mt-4 p-4 bg-primary/5 rounded-lg">
                  <p className="text-lg font-semibold text-primary">
                    Total: ${calculateOrderTotal(formData.lineItems).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOrder ? "Update Order" : "Create Order"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-primary">Purchase Order Details</h2>
              <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">PO-{selectedOrder.Id.toString().padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-medium">{getVendorName(selectedOrder.vendorId)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <Badge variant={getPriorityColor(selectedOrder.priority)}>
                    {selectedOrder.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Delivery</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.expectedDelivery), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              {selectedOrder.description && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{selectedOrder.description}</p>
                </div>
              )}

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                  <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-primary mb-3">Line Items</h3>
                <div className="space-y-3">
                  {selectedOrder.lineItems?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ${item.unitPrice}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${(item.quantity * item.unitPrice).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">Total</p>
                    <p className="text-lg font-bold text-primary">
                      ${selectedOrder.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrders