import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { vendorService } from "@/services/api/vendorService"
import { toast } from "react-toastify"

const Vendors = () => {
  const navigate = useNavigate()
  const [vendors, setVendors] = useState([])
  const [filteredVendors, setFilteredVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const loadVendors = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await vendorService.getAll()
      setVendors(data)
      setFilteredVendors(data)
    } catch (err) {
      setError("Failed to load vendors")
      toast.error("Failed to load vendors")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [])

  useEffect(() => {
    let filtered = vendors

    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(vendor => 
        vendor.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    setFilteredVendors(filtered)
  }, [vendors, searchQuery, categoryFilter])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name={i < rating ? "Star" : "StarHalf"}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadVendors}
    />
  )

  const categories = [...new Set(vendors.map(v => v.category))]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Vendors
          </h1>
          <p className="text-gray-600">
            Manage your supplier relationships and procurement.
          </p>
        </div>
        
        <Button 
          variant="accent" 
          onClick={() => navigate("/vendors/new")}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          Add Vendor
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search vendors..."
          onSearch={handleSearch}
          className="flex-1"
        />
        
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </Select>
      </motion.div>

      {/* Vendors Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredVendors.length === 0 ? (
          <Empty
            title={searchQuery || categoryFilter !== "all" ? "No vendors match your filters" : "No vendors yet"}
            description={searchQuery || categoryFilter !== "all" ? "Try adjusting your search or filter criteria" : "Start by adding your first vendor or supplier"}
            icon="Building2"
            actionLabel="Add Vendor"
            onAction={() => navigate("/vendors/new")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <motion.div
                key={vendor.Id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-premium transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <ApperIcon name="Building2" className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary text-lg">{vendor.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {vendor.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vendor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vendor.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{vendor.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Rating</p>
                        <div className="flex items-center gap-1">
                          {getRatingStars(vendor.rating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({vendor.rating})
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Projects</p>
                        <p className="font-semibold text-primary">{vendor.projectCount}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/vendors/${vendor.Id}`)}
                      >
                        <ApperIcon name="ArrowRight" className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Vendors