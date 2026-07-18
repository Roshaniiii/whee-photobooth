import { useRef, useEffect, useState, useMemo, useId } from 'react'
import './CurvedLoop.css'

const CurvedLoop = ({
  marqueeText = '',
  speed = 1,
  className,
  curveAmount = 0,
  direction = 'right',
  interactive = true,
  style,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText)
    return (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0'
  }, [marqueeText])

  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const [spacing, setSpacing] = useState(0)
  const [offset, setOffset] = useState(0)
  const uid = useId()
  const pathId = `curve-${uid}`
  const pathD = 'M-140,60 L1580,60'
  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const dirRef = useRef(direction)
  const velRef = useRef(0)

  const textLength = spacing
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
      .fill(text)
      .join('')
    : text
  const ready = spacing > 0

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) {
        const measured = measureRef.current.getComputedTextLength()
        setSpacing(measured || text.length * 18)
      }
    }

    const frame = requestAnimationFrame(measure)
    const timeout = window.setTimeout(measure, 80)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [text, className])

  useEffect(() => {
    if (!spacing) return
    if (textPathRef.current) {
      const initial = 0
      textPathRef.current.setAttribute('startOffset', initial + 'px')
      setOffset(initial)
    }
  }, [spacing])

  useEffect(() => {
    if (!spacing || !ready) return
    let frame = 0
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? speed : -speed
        const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
        let newOffset = currentOffset + delta

        const wrapPoint = spacing
        if (newOffset <= -wrapPoint) newOffset += wrapPoint
        if (newOffset > 0) newOffset -= wrapPoint

        textPathRef.current.setAttribute('startOffset', newOffset + 'px')
        setOffset(newOffset)
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [spacing, speed, ready])

  const onPointerDown = e => {
    if (!interactive) return
    dragRef.current = true
    lastXRef.current = e.clientX
    velRef.current = 0
    e.target.setPointerCapture(e.pointerId)
  }

  const onPointerMove = e => {
    if (!interactive || !dragRef.current || !textPathRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    velRef.current = dx

    const currentOffset = parseFloat(textPathRef.current.getAttribute('startOffset') || '0')
    let newOffset = currentOffset + dx

    const wrapPoint = spacing
    if (newOffset <= -wrapPoint) newOffset += wrapPoint
    if (newOffset > 0) newOffset -= wrapPoint

    textPathRef.current.setAttribute('startOffset', newOffset + 'px')
    setOffset(newOffset)
  }

  const endDrag = () => {
    if (!interactive) return
    dragRef.current = false
    dirRef.current = velRef.current > 0 ? 'right' : 'left'
  }

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto'

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle, ...style }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <div className="curved-loop-container">
        <div className="curved-loop-reference" aria-hidden>
          <div className="ref-bar" />
          <div className="ref-handle ref-left">
            <div className="ref-line" />
            <div className="ref-circle" />
          </div>
          <div className="ref-handle ref-right">
            <div className="ref-line" />
            <div className="ref-circle" />
          </div>
        </div>

        <svg className="curved-loop-svg" viewBox="0 0 1440 100" preserveAspectRatio="xMidYMid meet">
          <text ref={measureRef} xmlSpace="preserve" style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
            {text}
          </text>
          <defs>
            <path id={pathId} d={pathD} fill="none" stroke="transparent" />
            {/* Clip so text only shows inside the bar */}
            <clipPath id={`clip-${uid}`}>
              <rect x="82" y="20" width="1270" height="80" rx="22" />
            </clipPath>
          </defs>
          {ready && (
              <g clipPath={`url(#clip-${uid})`}>
                <text fontWeight="bold" xmlSpace="preserve" className={className}>
                  <textPath
                    ref={textPathRef}
                    href={`#${pathId}`}
                    startOffset={offset + 'px'}
                    xmlSpace="preserve"
                    style={{ fill: '#917264', fontFamily: "'Cause', serif" }}
                  >
                    {totalText}
                  </textPath>
                </text>
              </g>
            )}
        </svg>
      </div>
    </div>
  )
}

export default CurvedLoop
