import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Camera from './pages/Camera'
import Customise from './pages/Customise'
import Contact from './pages/Contact'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import FeedbackButton from './components/FeedbackButton'
import SupportButton from './components/SupportButton'
import AnnouncementPopup from './components/AnnouncementPopup'
import './mobile.css'

function App() {

  useEffect(() => {
    const wake = () => {
      fetch(`${import.meta.env.VITE_API_URL}/health`)
        .catch(() => { })
    }
    wake()
    const interval = setInterval(wake, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <Navbar />
      <SupportButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/customise" element={<Customise />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
      </Routes>
      <AnnouncementPopup /> 
    </BrowserRouter>
  )
}

export default App