import clientsData from "@/services/mockData/clients.json"

class ClientService {
  constructor() {
    this.clients = [...clientsData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.clients]
  }

  async getById(id) {
    await this.delay(200)
    const client = this.clients.find(c => c.Id === parseInt(id))
    if (!client) throw new Error("Client not found")
    return { ...client }
  }

  async create(clientData) {
    await this.delay(400)
    const newClient = {
      ...clientData,
      Id: Math.max(...this.clients.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString()
    }
    this.clients.push(newClient)
    return { ...newClient }
  }

  async update(id, updateData) {
    await this.delay(300)
    const index = this.clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Client not found")
    
    this.clients[index] = { ...this.clients[index], ...updateData }
    return { ...this.clients[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.clients.findIndex(c => c.Id === parseInt(id))
    if (index === -1) throw new Error("Client not found")
    
    this.clients.splice(index, 1)
    return true
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export const clientService = new ClientService()