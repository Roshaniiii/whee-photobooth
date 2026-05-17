import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'

const FILTERS = [
  { id: 'none',   label: 'Normal',   emoji: '📷' },
  { id: 'vhs',    label: 'VHS',      emoji: '📼' },
  { id: 'glitch', label: 'Glitch',   emoji: '⚡' },
  { id: 'y2k',    label: 'Y2K',      emoji: '💿' },
  { id: 'crt',    label: 'CRT',      emoji: '📺' },
  { id: 'grain',  label: 'Grain',    emoji: '🎞' },
  { id: 'chroma', label: 'Chroma',   emoji: '🌈' },
]

const TIMERS = [0, 3, 5, 10]

export default function Camera() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const intervalRef = useRef(null)
  const streamRef = useRef(null)

  const [selectedFilter, setSelectedFilter] = useState('none')
  const [filteredFrame, setFilteredFrame] = useState(null)
  const [timer, setTimer] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [facingMode, setFacingMode] = useState('user')
  const [isLoading, setIsLoading] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const layout = sessionStorage.getItem('layout') || 'single'
  const totalShots = parseInt(sessionStorage.getItem('shots') || '1')
  const uploadedImage = sessionStorage.getItem('uploadedImage')

  // Start webcam
  useEffect(() => {
    if (uploadedImage) {
      setCameraReady(true)
      setFilteredFrame(uploadedImage)
      return
    }
    startCamera()
    return () => stopCamera()
  }, [facingMode])

  async function startCamera() {
    try {
      if (streamRef.current) stopCamera()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraReady(true)
        }
      }
    } catch (err) {
      alert('Camera access denied. Please allow camera permission and refresh.')
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  // Capture frame from webcam as base64
  function captureFrame() {
    if (uploadedImage) return uploadedImage.split(',')[1]
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return null
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
    return dataUrl.split(',')[1]
  }

  // Live filter preview loop — sends frame to Python every 400ms
  useEffect(() => {
    if (!cameraReady) return
    if (selectedFilter === 'none') {
      setFilteredFrame(null)
      return
    }
    intervalRef.current = setInterval(async () => {
      const frame = captureFrame()
      if (!frame) return
      try {
        const res = await fetch('http://localhost:8000/apply-filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: frame, filter: selectedFilter })
        })
        const data = await res.json()
        setFilteredFrame('data:image/jpeg;base64,' + data.image)
      } catch (err) {
        console.error('Filter error:', err)
      }
    }, 400)

    return () => clearInterval(intervalRef.current)
  }, [selectedFilter, cameraReady])

  // Take one photo
  async function takePhoto() {
    setIsLoading(true)
    const frame = captureFrame()
    if (!frame) return

    let finalImage = 'data:image/jpeg;base64,' + frame

    if (selectedFilter !== 'none') {
      try {
        const res = await fetch('http://localhost:8000/apply-filter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: frame, filter: selectedFilter })
        })
        const data = await res.json()
        finalImage = 'data:image/jpeg;base64,' + data.image
      } catch (err) {
        console.error('Capture filter error:', err)
      }
    }

    setCapturedPhotos(prev => {
      const updated = [...prev, finalImage]
      return updated
    })
    setIsLoading(false)
  }

  // Handle capture with optional timer
  function handleCapture() {
    if (countdown !== null) return
    if (timer === 0) {
      takePhoto()
      return
    }
    let count = timer
    setCountdown(count)
    const tick = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(tick)
        setCountdown(null)
        takePhoto()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }

  // Flip camera (mobile)
  function flipCamera() {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    setCameraReady(false)
    setFilteredFrame(null)
  }

  // Proceed to customise
  function handleCustomise() {
    sessionStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos))
    sessionStorage.setItem('layout', layout)
    navigate('/customise')
  }

  // Download directly
  function handleDownload() {
    capturedPhotos.forEach((photo, i) => {
      const a = document.createElement('a')
      a.href = photo
      a.download = `y2k-photo-${i + 1}.jpg`
      a.click()
    })
  }

  const allShotsTaken = capturedPhotos.length >= totalShots

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0a0f 70%)'
    }}>
      <div className="window" style={{ width: '100%', maxWidth: '800px' }}>

        {/* Title Bar */}
        <div className="window-titlebar">
          <span>📷 Y2K Photobooth — Camera</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>_</span>
            <span style={{ background: '#c0c0c0', color: '#000', padding: '0 6px', fontSize: '12px' }}>□</span>
            <span style={{ background: '#ff4444', color: '#fff', padding: '0 6px', fontSize: '12px' }}>✕</span>
          </div>
        </div>

        <div className="window-body" style={{ padding: '16px' }}>

          {/* Top Bar - Timer + Shot Counter */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* Timer selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#c0c0c0', fontSize: '12px', letterSpacing: '1px' }}>TIMER:</span>
              {TIMERS.map(t => (
                <button
                  key={t}
                  onClick={() => setTimer(t)}
                  style={{
                    background: timer === t ? '#ff69b4' : '#1a1a2e',
                    color: timer === t ? '#000' : '#ff69b4',
                    border: '2px solid #ff69b4',
                    padding: '4px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: 'Courier New',
                    fontWeight: 'bold'
                  }}
                >
                  {t === 0 ? 'OFF' : `${t}s`}
                </button>
              ))}
            </div>

            {/* Shot counter */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ color: '#c0c0c0', fontSize: '12px' }}>SHOTS:</span>
              {Array.from({ length: totalShots }).map((_, i) => (
                <div key={i} style={{
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: i < capturedPhotos.length ? '#ff69b4' : '#333',
                  border: '2px solid #ff69b4',
                  boxShadow: i < capturedPhotos.length ? '0 0 8px #ff69b4' : 'none'
                }} />
              ))}
            </div>
          </div>

          {/* Main Area - Camera + Thumbnails */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '12px',
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>

            {/* Left - Flip button */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              justifyContent: 'center'
            }}>
              <button className="btn-secondary" onClick={flipCamera}
                style={{ padding: '8px 12px', fontSize: '12px' }}>
                🔄 Flip
              </button>
              <button className="btn-secondary" onClick={() => navigate('/layout')}
                style={{ padding: '8px 12px', fontSize: '12px' }}>
                ← Back
              </button>
            </div>

            {/* Center - Camera Preview */}
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>

              {/* Countdown overlay */}
              {countdown !== null && (
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.4)'
                }}>
                  <span style={{
                    fontSize: '120px', fontWeight: 'bold',
                    color: '#ff69b4',
                    textShadow: '0 0 40px #ff69b4'
                  }}>
                    {countdown}
                  </span>
                </div>
              )}

              {/* Loading overlay */}
              {isLoading && (
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, background: 'rgba(0,0,0,0.6)'
                }}>
                  <span style={{ color: '#ff69b4', fontSize: '16px', letterSpacing: '2px' }}>
                    PROCESSING...
                  </span>
                </div>
              )}

              {/* Filtered frame shown on top of video */}
              {filteredFrame && selectedFilter !== 'none' ? (
                <img
                  src={filteredFrame}
                  alt="filtered preview"
                  style={{ width: '100%', display: 'block', border: '2px solid #333' }}
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    display: uploadedImage ? 'none' : 'block',
                    border: '2px solid #333',
                    transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                  }}
                />
              )}

              {/* Uploaded image preview */}
              {uploadedImage && selectedFilter === 'none' && (
                <img src={uploadedImage} alt="upload"
                  style={{ width: '100%', display: 'block', border: '2px solid #333' }} />
              )}

              {/* Hidden canvas for frame capture */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            {/* Right - Captured thumbnails */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              minWidth: '60px'
            }}>
              {Array.from({ length: totalShots }).map((_, i) => (
                <div key={i} style={{
                  width: '60px', height: '60px',
                  border: capturedPhotos[i] ? '2px solid #ff69b4' : '2px dashed #333',
                  background: '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  overflow: 'hidden'
                }}>
                  {capturedPhotos[i]
                    ? <img src={capturedPhotos[i]} alt={`shot ${i+1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ color: '#333' }}>{i + 1}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* Filter Strip */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '16px'
          }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                style={{
                  minWidth: '72px',
                  padding: '8px 6px',
                  background: selectedFilter === f.id ? '#ff69b4' : '#111',
                  color: selectedFilter === f.id ? '#000' : '#fff',
                  border: selectedFilter === f.id ? '2px solid #fff' : '2px solid #333',
                  cursor: 'pointer',
                  fontFamily: 'Courier New',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: selectedFilter === f.id ? '0 0 12px #ff69b4' : 'none',
                  flexShrink: 0
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{f.emoji}</div>
                {f.label}
              </button>
            ))}
          </div>

          {/* Capture + Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {!allShotsTaken ? (
              <button
                className="btn-y2k"
                onClick={handleCapture}
                disabled={!cameraReady || countdown !== null || isLoading}
                style={{
                  opacity: cameraReady ? 1 : 0.5,
                  fontSize: '18px',
                  padding: '14px 32px'
                }}
              >
                {countdown !== null ? `${countdown}...` : isLoading ? 'PROCESSING...' : '📷 CAPTURE'}
              </button>
            ) : (
              <>
                <button className="btn-secondary"
                  onClick={() => setCapturedPhotos([])}>
                  🔄 Retake
                </button>
                <button className="btn-y2k" onClick={handleDownload}>
                  ⬇ Download
                </button>
                <button className="btn-y2k"
                  onClick={handleCustomise}
                  style={{ background: '#00ffff', color: '#000' }}>
                  ✏ Customise
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}