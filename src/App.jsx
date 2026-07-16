import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Camera from './pages/Camera'
import Customise from './pages/Customise'
import FeedbackButton from './components/FeedbackButton'
import SupportButton from './components/SupportButton'
import './mobile.css'

function App() {

  useEffect(() => {
    const wake = () => {
      fetch(`${import.meta.env.VITE_API_URL}/health`)
        .catch(() => {})
    }
    wake()
    const interval = setInterval(wake, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/customise" element={<Customise />} />
      </Routes>
      <FeedbackButton />
      <SupportButton/>
    </BrowserRouter>
  )
}

export default App