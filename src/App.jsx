import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "@/components/Layout"
import Dashboard from "@/components/pages/Dashboard"
import Projects from "@/components/pages/Projects"
import Leads from "@/components/pages/Leads"
import Clients from "@/components/pages/Clients"
import Vendors from "@/components/pages/Vendors"
import Finances from "@/components/pages/Finances"
import Tasks from "@/components/pages/Tasks"
import Settings from "@/components/pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="leads" element={<Leads />} />
          <Route path="clients" element={<Clients />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="finances" element={<Finances />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App