import financesData from "@/services/mockData/finances.json"

class FinanceService {
  constructor() {
    this.finances = [...financesData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.finances]
  }

  async getById(id) {
    await this.delay(200)
    const finance = this.finances.find(f => f.Id === parseInt(id))
    if (!finance) throw new Error("Finance record not found")
    return { ...finance }
  }

  async create(financeData) {
    await this.delay(400)
    const newFinance = {
      ...financeData,
      Id: Math.max(...this.finances.map(f => f.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.finances.push(newFinance)
    return { ...newFinance }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.finances.findIndex(f => f.Id === parseInt(id))
    if (index === -1) throw new Error("Finance record not found")
    
    this.finances[index] = { ...this.finances[index], ...updateData }
    return { ...this.finances[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.finances.findIndex(f => f.Id === parseInt(id))
    if (index === -1) throw new Error("Finance record not found")
    
    this.finances.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const financeService = new FinanceService()