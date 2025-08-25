import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import Badge from "@/components/atoms/Badge"
import Select from "@/components/atoms/Select"
import StatusChip from "@/components/molecules/StatusChip"
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
  const [pricingTierFilter, setPricingTierFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

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
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.phone.includes(searchQuery) ||
        vendor.catalogs.some(catalog => 
          catalog.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(vendor => 
        vendor.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    if (pricingTierFilter !== "all") {
      filtered = filtered.filter(vendor => 
        vendor.pricing.tier.toLowerCase() === pricingTierFilter.toLowerCase()
      )
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'rating') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      } else if (sortBy === 'projectCount') {
        aValue = parseInt(aValue)
        bValue = parseInt(bValue)
      } else if (sortBy === 'pricing') {
        aValue = a.pricing.discountRate
        bValue = b.pricing.discountRate
      } else if (sortBy === 'catalogs') {
        aValue = a.catalogs.length
        bValue = b.catalogs.length
      } else {
        aValue = aValue?.toString().toLowerCase() || ''
        bValue = bValue?.toString().toLowerCase() || ''
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredVendors(filtered)
  }, [vendors, searchQuery, categoryFilter, pricingTierFilter, sortBy, sortOrder])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon
        key={i}
        name={i < rating ? "Star" : "StarHalf"}
        className={`h-3 w-3 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  const getTierBadgeVariant = (tier) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return 'accent'
      case 'standard':
        return 'info'
      default:
        return 'default'
    }
  }

  const handleVendorAction = async (action, vendorId) => {
    try {
      switch (action) {
        case 'edit':
          navigate(`/vendors/${vendorId}/edit`)
          break
        case 'view-catalogs':
          navigate(`/vendors/${vendorId}/catalogs`)
          break
        case 'view-pricing':
          navigate(`/vendors/${vendorId}/pricing`)
          break
        case 'delete':
          if (window.confirm('Are you sure you want to delete this vendor?')) {
            await vendorService.delete(vendorId)
            toast.success('Vendor deleted successfully')
            loadVendors()
          }
          break
        default:
          break
      }
    } catch (err) {
      toast.error(`Failed to ${action} vendor`)
    }
  }

  if (loading) return <Loading />
  
  if (error) return (
    <Error 
      message={error}
      onRetry={loadVendors}
    />
  )

  const categories = [...new Set(vendors.map(v => v.category))]
  const pricingTiers = [...new Set(vendors.map(v => v.pricing.tier))]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-primary mb-2">
            Vendor Management
          </h1>
          <p className="text-gray-600">
            Comprehensive vendor database with contact information, catalogs, and pricing.
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
        className="flex flex-col lg:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search vendors, contacts, catalogs..."
          onSearch={handleSearch}
          className="flex-1"
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
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

          <Select
            value={pricingTierFilter}
            onChange={(e) => setPricingTierFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">All Pricing Tiers</option>
            {pricingTiers.map(tier => (
              <option key={tier} value={tier.toLowerCase()}>
                {tier}
              </option>
            ))}
          </Select>
        </div>
      </motion.div>

      {/* Vendors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredVendors.length === 0 ? (
          <Empty
            title={searchQuery || categoryFilter !== "all" || pricingTierFilter !== "all" ? "No vendors match your filters" : "No vendors yet"}
            description={searchQuery || categoryFilter !== "all" || pricingTierFilter !== "all" ? "Try adjusting your search or filter criteria" : "Start by adding your first vendor or supplier"}
            icon="Building2"
            actionLabel="Add Vendor"
            onAction={() => navigate("/vendors/new")}
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Vendor
                        <ApperIcon 
                          name={sortBy === 'name' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          className="h-4 w-4" 
                        />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">
                      Contact Information
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-2">
                        Category
                        <ApperIcon 
                          name={sortBy === 'category' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          className="h-4 w-4" 
                        />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('catalogs')}
                    >
                      <div className="flex items-center gap-2">
                        Catalogs
                        <ApperIcon 
                          name={sortBy === 'catalogs' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          className="h-4 w-4" 
                        />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('pricing')}
                    >
                      <div className="flex items-center gap-2">
                        Pricing
                        <ApperIcon 
                          name={sortBy === 'pricing' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          className="h-4 w-4" 
                        />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-sm font-semibold text-primary cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-2">
                        Rating
                        <ApperIcon 
                          name={sortBy === 'rating' ? (sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                          className="h-4 w-4" 
                        />
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredVendors.map((vendor, index) => (
                    <motion.tr
                      key={vendor.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                            <ApperIcon name="Building2" className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-primary">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <ApperIcon name="Mail" className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{vendor.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <ApperIcon name="Phone" className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600">{vendor.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-xs">
                          {vendor.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-primary">
                            {vendor.catalogs.length} catalog{vendor.catalogs.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vendor.catalogs.reduce((total, catalog) => total + catalog.items, 0)} total items
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs p-1 h-auto"
                            onClick={() => handleVendorAction('view-catalogs', vendor.Id)}
                          >
                            View Catalogs
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <Badge 
                            variant={getTierBadgeVariant(vendor.pricing.tier)}
                            className="text-xs"
                          >
                            {vendor.pricing.tier}
                          </Badge>
                          <div className="text-xs text-gray-600">
                            <div>{vendor.pricing.discountRate}% discount</div>
                            <div>Min: ${vendor.pricing.minimumOrder.toLocaleString()}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs p-1 h-auto"
                            onClick={() => handleVendorAction('view-pricing', vendor.Id)}
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {getRatingStars(vendor.rating)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vendor.projectCount} projects
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVendorAction('edit', vendor.Id)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit" className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVendorAction('delete', vendor.Id)}
                            className="p-2 text-error hover:text-error"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

export default Vendors