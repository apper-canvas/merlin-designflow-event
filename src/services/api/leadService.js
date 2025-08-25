import leadsData from "@/services/mockData/leads.json"

class LeadService {
  constructor() {
    this.leads = [...leadsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.leads]
  }

  async getById(id) {
    await this.delay(200)
    const lead = this.leads.find(l => l.Id === parseInt(id))
    if (!lead) throw new Error("Lead not found")
    return { ...lead }
  }

  async create(leadData) {
    await this.delay(400)
    const newLead = {
      ...leadData,
      Id: Math.max(...this.leads.map(l => l.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.leads.push(newLead)
    return { ...newLead }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("Lead not found")
    
    this.leads[index] = { ...this.leads[index], ...updateData }
    return { ...this.leads[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.leads.findIndex(l => l.Id === parseInt(id))
    if (index === -1) throw new Error("Lead not found")
    
    this.leads.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const leadService = new LeadService()