import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Layout from './pages/Layout'
import Camera from './pages/Camera'
import Customise from './pages/Customise'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/layout" element={<Layout />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/customise" element={<Customise />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App