import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [settings, setSettings] = useState({
    companyName: "DesignFlow Pro",
    email: "admin@designflowpro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Design Street, Creative City, CC 12345",
    currency: "USD",
    timezone: "America/New_York",
    invoicePrefix: "DF-",
    taxRate: "8.5"
  })

  const tabs = [
    { id: "profile", label: "Company Profile", icon: "Building2" },
    { id: "billing", label: "Billing & Invoicing", icon: "CreditCard" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "integrations", label: "Integrations", icon: "Plug" },
  ]

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    toast.success("Settings saved successfully!")
  }

  const CompanyProfile = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Company Name" required>
          <Input
            value={settings.companyName}
            onChange={(e) => handleSettingChange("companyName", e.target.value)}
            placeholder="Enter company name"
          />
        </FormField>
        
        <FormField label="Email Address" required>
          <Input
            type="email"
            value={settings.email}
            onChange={(e) => handleSettingChange("email", e.target.value)}
            placeholder="Enter email address"
          />
        </FormField>
        
        <FormField label="Phone Number">
          <Input
            value={settings.phone}
            onChange={(e) => handleSettingChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </FormField>
        
        <FormField label="Timezone">
          <Select
            value={settings.timezone}
            onChange={(e) => handleSettingChange("timezone", e.target.value)}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </Select>
        </FormField>
      </div>
      
      <FormField label="Company Address">
        <Input
          value={settings.address}
          onChange={(e) => handleSettingChange("address", e.target.value)}
          placeholder="Enter full address"
        />
      </FormField>
    </div>
  )

  const BillingSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Currency">
          <Select
            value={settings.currency}
            onChange={(e) => handleSettingChange("currency", e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </Select>
        </FormField>
        
        <FormField label="Invoice Prefix">
          <Input
            value={settings.invoicePrefix}
            onChange={(e) => handleSettingChange("invoicePrefix", e.target.value)}
            placeholder="e.g., INV-, DF-"
          />
        </FormField>
        
        <FormField label="Default Tax Rate (%)">
          <Input
            value={settings.taxRate}
            onChange={(e) => handleSettingChange("taxRate", e.target.value)}
            placeholder="Enter tax rate"
          />
        </FormField>
      </div>
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Payment Integration</h4>
              <p className="text-sm text-blue-600 mb-3">
                Connect payment providers to accept online payments from clients.
              </p>
              <Button variant="outline" size="sm">
                Setup Stripe
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const NotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-primary mb-4">Email Notifications</h3>
      
      <div className="space-y-4">
        {[
          { key: "projectUpdates", label: "Project Updates", desc: "Get notified when projects are updated" },
          { key: "paymentReminders", label: "Payment Reminders", desc: "Remind clients about pending payments" },
          { key: "taskDeadlines", label: "Task Deadlines", desc: "Get alerts before task deadlines" },
          { key: "clientMessages", label: "Client Messages", desc: "Receive notifications for client communications" },
        ].map((notification) => (
          <Card key={notification.key}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary">{notification.label}</h4>
                  <p className="text-sm text-gray-600">{notification.desc}</p>
                </div>
                <Button variant="outline" size="sm">
                  <ApperIcon name="Check" className="h-4 w-4 mr-1" />
                  Enabled
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const Integrations = () => (
    <div className="space-y-6">
      <h3 className="font-semibold text-primary mb-4">Available Integrations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { name: "Google Drive", desc: "Sync project files with Google Drive", icon: "Cloud", connected: true },
          { name: "Dropbox", desc: "Store and share files via Dropbox", icon: "HardDrive", connected: false },
          { name: "Slack", desc: "Send notifications to Slack channels", icon: "MessageSquare", connected: false },
          { name: "QuickBooks", desc: "Sync financial data with QuickBooks", icon: "Calculator", connected: false },
        ].map((integration) => (
          <Card key={integration.name}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <ApperIcon name={integration.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-primary mb-1">{integration.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{integration.desc}</p>
                  <Button 
                    variant={integration.connected ? "outline" : "accent"} 
                    size="sm"
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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
            Settings
          </h1>
          <p className="text-gray-600">
            Configure your DesignFlow Pro workspace and preferences.
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-64"
        >
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-gradient-accent text-white"
                        : "text-gray-600 hover:bg-surface"
                    }`}
                  >
                    <ApperIcon name={tab.icon} className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === "profile" && <CompanyProfile />}
              {activeTab === "billing" && <BillingSettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "integrations" && <Integrations />}
              
              <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
                <Button variant="accent" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings