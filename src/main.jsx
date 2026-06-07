import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginView from './features/auth/login.view.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
