import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import LeadCard from "@/components/organisms/LeadCard"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import { leadService } from "@/services/api/leadService"
import { projectService } from "@/services/api/projectService"
import { toast } from "react-toastify"

const Leads = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const loadLeads = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await leadService.getAll()
      setLeads(data)
      setFilteredLeads(data)
    } catch (err) {
      setError("Failed to load leads")
      toast.error("Failed to load leads")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  useEffect(() => {
    let filtered = leads

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.projectType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(lead => 
        lead.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    setFilteredLeads(filtered)
  }, [leads, searchQuery, statusFilter])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleConvertLead = async (lead) => {
    try {
      // Create new project from lead
      const newProject = {
        name: `${lead.projectType} Project`,
        client: lead.name,
        clientEmail: lead.email,
        clientPhone: lead.phone,
        status: "Planning",
        projectType: lead.projectType,
        budget: parseFloat(lead.budget.replace(/[^0-9]/g, "")),
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
        location: "TBD",
        spent: 0
      }

      await projectService.create(newProject)
      
      // Update lead status
      await leadService.update(lead.Id, { ...lead, status: "Converted" })
      
      setLeads(prev => prev.map(l => 
        l.Id === lead.Id ? { ...l, status: "Converted" } : l
      ))
      
      toast.success("Lead converted to project successfully!")
      navigate("/projects")
    } catch (err) {
      toast.error("Failed to convert lead")
    }
  }

  const handleUpdateLead = (lead) => {
    navigate(`/leads/${lead.Id}/edit`)
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadLeads}
    />
  )

  const leadsByStatus = {
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    qualified: leads.filter(l => l.status === "Qualified").length,
    converted: leads.filter(l => l.status === "Converted").length
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
            Leads
          </h1>
          <p className="text-gray-600">
            Manage potential clients and convert them into projects.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => navigate("/leads/new")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="UserPlus" className="h-4 w-4" />
          Add Lead
        </Button>
      </motion.div>

      {/* Lead Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ApperIcon name="UserPlus" className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-xl font-bold text-primary">{leadsByStatus.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <ApperIcon name="Phone" className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-xl font-bold text-primary">{leadsByStatus.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ApperIcon name="CheckCircle" className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Qualified</p>
                <p className="text-xl font-bold text-primary">{leadsByStatus.qualified}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ApperIcon name="Trophy" className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-xl font-bold text-primary">{leadsByStatus.converted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search leads..."
          onSearch={handleSearch}
          className="flex-1"
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
        </Select>
      </motion.div>

      {/* Leads Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredLeads.length === 0 ? (
          <Empty
            title={searchQuery || statusFilter !== "all" ? "No leads match your filters" : "No leads yet"}
            description={searchQuery || statusFilter !== "all" ? "Try adjusting your search or filter criteria" : "Start by adding your first potential client"}
            icon="Users"
            actionLabel="Add Lead"
            onAction={() => navigate("/leads/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.Id}
                lead={lead}
                onConvert={handleConvertLead}
                onUpdate={handleUpdateLead}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Leads