import purchaseOrdersData from "@/services/mockData/purchaseOrders.json"

class PurchaseOrderService {
  constructor() {
    this.purchaseOrders = [...purchaseOrdersData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.purchaseOrders]
  }

  async getById(id) {
    await this.delay(200)
    const order = this.purchaseOrders.find(o => o.Id === parseInt(id))
    if (!order) throw new Error("Purchase order not found")
    return { ...order }
  }

  async create(orderData) {
    await this.delay(400)
    const newOrder = {
      ...orderData,
      Id: Math.max(...this.purchaseOrders.map(o => o.Id)) + 1,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvalHistory: [],
      trackingInfo: null
    }
    this.purchaseOrders.push(newOrder)
    return { ...newOrder }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.purchaseOrders.findIndex(o => o.Id === parseInt(id))
    if (index === -1) throw new Error("Purchase order not found")
    
    this.purchaseOrders[index] = { 
      ...this.purchaseOrders[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.purchaseOrders[index] }
  }

  async updateStatus(id, newStatus, approver = null, notes = "") {
    await this.delay(300)
    const index = this.purchaseOrders.findIndex(o => o.Id === parseInt(id))
    if (index === -1) throw new Error("Purchase order not found")
    
    const order = this.purchaseOrders[index]
    const oldStatus = order.status
    
    // Update status
    order.status = newStatus
    order.updatedAt = new Date().toISOString()
    
    // Add to approval history
    order.approvalHistory = order.approvalHistory || []
    order.approvalHistory.push({
      from: oldStatus,
      to: newStatus,
      approver: approver || "System",
      timestamp: new Date().toISOString(),
      notes: notes
    })
    
    // Auto-generate tracking info when order is sent
    if (newStatus === "ordered") {
      order.trackingInfo = {
        trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
        carrier: "FedEx",
        estimatedDelivery: order.expectedDelivery,
        status: "shipped"
      }
    }
    
    // Update delivery status when delivered
    if (newStatus === "delivered") {
      order.actualDelivery = new Date().toISOString()
      if (order.trackingInfo) {
        order.trackingInfo.status = "delivered"
        order.trackingInfo.actualDelivery = order.actualDelivery
      }
    }
    
    return { ...order }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.purchaseOrders.findIndex(o => o.Id === parseInt(id))
    if (index === -1) throw new Error("Purchase order not found")
    
    const order = this.purchaseOrders[index]
    if (order.status !== "draft") {
      throw new Error("Cannot delete purchase order that has been submitted")
    }
    
    this.purchaseOrders.splice(index, 1)
    return true
  }

  async getByStatus(status) {
    await this.delay(200)
    return this.purchaseOrders.filter(o => o.status === status)
  }

  async getByVendor(vendorId) {
    await this.delay(200)
    return this.purchaseOrders.filter(o => o.vendorId === parseInt(vendorId))
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const purchaseOrderService = new PurchaseOrderService()