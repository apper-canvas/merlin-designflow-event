import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { clientService } from "@/services/api/clientService"
import { projectService } from "@/services/api/projectService"
import { financeService } from "@/services/api/financeService"
import { toast } from "react-toastify"
import { format } from "date-fns"

const InvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [projects, setProjects] = useState([])
  const [errors, setErrors] = useState({})
  
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    invoiceNumber: "",
    issueDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    description: "",
    notes: "",
    lineItems: [
      { description: "", quantity: 1, rate: 0, amount: 0 }
    ]
  })

  useEffect(() => {
    if (isOpen) {
      loadData()
      generateInvoiceNumber()
    }
  }, [isOpen])

  const loadData = async () => {
    try {
      const [clientsData, projectsData] = await Promise.all([
        clientService.getAll(),
        projectService.getAll()
      ])
      setClients(clientsData)
      setProjects(projectsData)
    } catch (error) {
      toast.error("Failed to load data")
    }
  }

  const generateInvoiceNumber = async () => {
    try {
      const finances = await financeService.getAll()
      const invoices = finances.filter(f => f.type === "income")
      const nextNumber = `INV-${String(invoices.length + 1).padStart(4, '0')}`
      setFormData(prev => ({ ...prev, invoiceNumber: nextNumber }))
    } catch (error) {
      console.error("Failed to generate invoice number:", error)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.clientId) newErrors.clientId = "Client is required"
    if (!formData.invoiceNumber) newErrors.invoiceNumber = "Invoice number is required"
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required"
    if (!formData.dueDate) newErrors.dueDate = "Due date is required"
    if (!formData.description) newErrors.description = "Description is required"
    
    if (formData.lineItems.length === 0) {
      newErrors.lineItems = "At least one line item is required"
    } else {
      formData.lineItems.forEach((item, index) => {
        if (!item.description) {
          newErrors[`lineItem_${index}_description`] = "Description is required"
        }
        if (item.quantity <= 0) {
          newErrors[`lineItem_${index}_quantity`] = "Quantity must be greater than 0"
        }
        if (item.rate <= 0) {
          newErrors[`lineItem_${index}_rate`] = "Rate must be greater than 0"
        }
      })
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleLineItemChange = (index, field, value) => {
    const newLineItems = [...formData.lineItems]
    newLineItems[index][field] = value
    
    // Calculate amount for this line item
    if (field === "quantity" || field === "rate") {
      newLineItems[index].amount = newLineItems[index].quantity * newLineItems[index].rate
    }
    
    setFormData(prev => ({ ...prev, lineItems: newLineItems }))
    
    // Clear related errors
    const errorKey = `lineItem_${index}_${field}`
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }))
    }
  }

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: "", quantity: 1, rate: 0, amount: 0 }]
    }))
  }

  const removeLineItem = (index) => {
    if (formData.lineItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.filter((_, i) => i !== index)
      }))
    }
  }

  const calculateTotal = () => {
    return formData.lineItems.reduce((sum, item) => sum + item.amount, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setLoading(true)
    try {
      const total = calculateTotal()
      const selectedClient = clients.find(c => c.Id === parseInt(formData.clientId))
      const selectedProject = projects.find(p => p.Id === parseInt(formData.projectId))
      
      const invoiceData = {
        type: "income",
        description: formData.description,
        amount: total,
        status: "pending",
        date: formData.issueDate,
        dueDate: formData.dueDate,
        clientId: parseInt(formData.clientId),
        clientName: selectedClient?.name || "",
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        projectName: selectedProject?.name || "",
        invoiceNumber: formData.invoiceNumber,
        lineItems: formData.lineItems,
        notes: formData.notes
      }

      await financeService.create(invoiceData)
      toast.success("Invoice created successfully!")
      onSuccess?.()
      handleClose()
    } catch (error) {
      toast.error("Failed to create invoice")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      clientId: "",
      projectId: "",
      invoiceNumber: "",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      description: "",
      notes: "",
      lineItems: [{ description: "", quantity: 1, rate: 0, amount: 0 }]
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  const filteredProjects = formData.clientId 
    ? projects.filter(p => p.clientId === parseInt(formData.clientId))
    : projects

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ApperIcon name="FileText" className="h-5 w-5" />
                Create New Invoice
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <ApperIcon name="X" className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Client" required error={errors.clientId}>
                  <Select
                    value={formData.clientId}
                    onChange={(e) => handleInputChange("clientId", e.target.value)}
                    error={errors.clientId}
                  >
                    <option value="">Select client...</option>
                    {clients.map(client => (
                      <option key={client.Id} value={client.Id}>
                        {client.name}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Project" error={errors.projectId}>
                  <Select
                    value={formData.projectId}
                    onChange={(e) => handleInputChange("projectId", e.target.value)}
                    disabled={!formData.clientId}
                  >
                    <option value="">Select project (optional)...</option>
                    {filteredProjects.map(project => (
                      <option key={project.Id} value={project.Id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField label="Invoice Number" required error={errors.invoiceNumber}>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                    placeholder="INV-0001"
                    error={errors.invoiceNumber}
                  />
                </FormField>

                <FormField label="Issue Date" required error={errors.issueDate}>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange("issueDate", e.target.value)}
                    error={errors.issueDate}
                  />
                </FormField>

                <FormField label="Due Date" required error={errors.dueDate}>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    error={errors.dueDate}
                  />
                </FormField>
              </div>

              <FormField label="Description" required error={errors.description}>
                <Input
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of work performed..."
                  error={errors.description}
                />
              </FormField>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-primary">Line Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
                    <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.lineItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="md:col-span-5">
                        <FormField label="Description" required error={errors[`lineItem_${index}_description`]}>
                          <Input
                            value={item.description}
                            onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                            placeholder="Service or item description..."
                            error={errors[`lineItem_${index}_description`]}
                          />
                        </FormField>
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField label="Quantity" required error={errors[`lineItem_${index}_quantity`]}>
                          <Input
                            type="number"
                            min="1"
                            step="1"
                            value={item.quantity}
                            onChange={(e) => handleLineItemChange(index, "quantity", parseInt(e.target.value) || 0)}
                            error={errors[`lineItem_${index}_quantity`]}
                          />
                        </FormField>
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField label="Rate" required error={errors[`lineItem_${index}_rate`]}>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleLineItemChange(index, "rate", parseFloat(e.target.value) || 0)}
                            error={errors[`lineItem_${index}_rate`]}
                          />
                        </FormField>
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField label="Amount">
                          <Input
                            type="text"
                            value={`$${item.amount.toLocaleString()}`}
                            disabled
                            className="bg-gray-50"
                          />
                        </FormField>
                      </div>
                      
                      <div className="md:col-span-1 flex items-end">
                        {formData.lineItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">
                      ${calculateTotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <FormField label="Additional Notes">
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Payment terms, additional information..."
                  rows={3}
                />
              </FormField>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  <ApperIcon name="FileText" className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default InvoiceModal