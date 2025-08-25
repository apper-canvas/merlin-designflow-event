import vendorsData from "@/services/mockData/vendors.json"

class VendorService {
  constructor() {
    this.vendors = [...vendorsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.vendors]
  }

  async getById(id) {
    await this.delay(200)
    const vendor = this.vendors.find(v => v.Id === parseInt(id))
    if (!vendor) throw new Error("Vendor not found")
    return { ...vendor }
  }

  async create(vendorData) {
    await this.delay(400)
    const newVendor = {
      ...vendorData,
      Id: Math.max(...this.vendors.map(v => v.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.vendors.push(newVendor)
    return { ...newVendor }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.vendors.findIndex(v => v.Id === parseInt(id))
    if (index === -1) throw new Error("Vendor not found")
    
    this.vendors[index] = { ...this.vendors[index], ...updateData }
    return { ...this.vendors[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.vendors.findIndex(v => v.Id === parseInt(id))
    if (index === -1) throw new Error("Vendor not found")
    
    this.vendors.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const vendorService = new VendorService()