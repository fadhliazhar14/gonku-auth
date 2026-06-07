import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginView from './features/auth/login.view.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import DashboardView from './features/dashboard/dashboard.view.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/dashboard" element={<DashboardView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
