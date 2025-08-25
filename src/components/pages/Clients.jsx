import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { clientService } from "@/services/api/clientService"
import { projectService } from "@/services/api/projectService"
import { toast } from "react-toastify"

const Clients = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ])
      setClients(clientsData)
      setProjects(projectsData)
      setFilteredClients(clientsData)
    } catch (err) {
      setError("Failed to load clients")
      toast.error("Failed to load clients")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredClients(filtered)
    } else {
      setFilteredClients(clients)
    }
  }, [clients, searchQuery])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const getClientProjects = (clientId) => {
    return projects.filter(p => p.clientId === clientId)
  }

  const getClientValue = (clientId) => {
    const clientProjects = getClientProjects(clientId)
    return clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
  }

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
            Clients
          </h1>
          <p className="text-gray-600">
            Manage your client relationships and project history.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => navigate("/clients/new")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" className="h-4 w-4" />
          Add Client
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SearchBar
          placeholder="Search clients..."
          onSearch={handleSearch}
          className="max-w-md"
        />
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredClients.length === 0 ? (
          <Empty
            title={searchQuery ? "No clients match your search" : "No clients yet"}
            description={searchQuery ? "Try adjusting your search criteria" : "Start by adding your first client"}
            icon="Users"
            actionLabel="Add Client"
            onAction={() => navigate("/clients/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => {
              const clientProjects = getClientProjects(client.Id)
              const totalValue = getClientValue(client.Id)
              const activeProjects = clientProjects.filter(p => p.status === "Active").length

              return (
                <motion.div
                  key={client.Id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="cursor-pointer hover:shadow-premium transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-accent flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary text-lg">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.email}</p>
                          </div>
                        </div>
                        {activeProjects > 0 && (
                          <Badge variant="success">{activeProjects} Active</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{client.phone}</span>
                        </div>
                        {client.location && (
                          <div className="flex items-center gap-2">
                            <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{client.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Total Projects</p>
                          <p className="font-semibold text-primary">{clientProjects.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Value</p>
                          <p className="font-semibold text-gradient">
                            ${totalValue.toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/clients/${client.Id}`)}
                        >
                          <ApperIcon name="ArrowRight" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Clients