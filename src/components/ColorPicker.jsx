import React, { useState, useRef, useEffect } from 'react'
import { SketchPicker } from 'react-color'
import { Pipette, SlidersHorizontal } from 'lucide-react'

export default function ColorPicker({
  value,
  onChange,
  presets = [],
  compact = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  // Standardize presets array into objects { hex, label }
  const normalizedPresets = presets.map((p) => {
    if (typeof p === 'string') {
      return { hex: p, label: p, id: p }
    }
    return p
  })

  // Preset hex strings for SketchPicker
  const presetHexes = normalizedPresets.map((p) => p.hex)

  // Current selected hex color string
  const currentHex = typeof value === 'string' ? value : value?.hex || '#DF82A3'

  const handleChange = (colorResult) => {
    const hex = colorResult.hex
    const matchedPreset = normalizedPresets.find(
      (p) => p.hex.toLowerCase() === hex.toLowerCase()
    )
    onChange(hex, matchedPreset || { id: 'custom', label: 'Custom', hex })
  }

  const handleSelectPreset = (p) => {
    onChange(p.hex, p)
  }

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  if (compact) {
    return (
      <div
        ref={popoverRef}
        className={`color-picker-wrapper compact ${className}`}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <button
          type="button"
          aria-label="Open color picker"
          title="Pick color"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: currentHex,
            border: '2px solid #DF82A3',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
        >
          <Pipette size={14} style={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              zIndex: 100,
              top: '34px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
              borderRadius: '8px',
            }}
          >
            <SketchPicker
              color={currentHex}
              onChangeComplete={handleChange}
              presetColors={presetHexes.length ? presetHexes : undefined}
              disableAlpha
              width="200px"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={popoverRef}
      className={`color-picker-wrapper standard ${className}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '8px', position: 'relative' }}
    >
      {/* Preset Swatches row + Sliders toggle button */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', maxWidth: '360px', alignItems: 'center' }}>
        {normalizedPresets.map((p) => {
          const isSelected = currentHex.toLowerCase() === p.hex.toLowerCase()
          return (
            <div
              key={p.id || p.hex}
              onClick={() => handleSelectPreset(p)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1px',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: p.hex,
                  border: isSelected ? '2px solid #917264' : '2px solid transparent',
                  boxShadow: isSelected ? '0 0 0 2px rgba(145,114,100,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </div>
          )
        })}

        {/* Sliders toggle button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Custom Color Sliders"
          style={{
            height: '24px',
            padding: '0 8px',
            borderRadius: '6px',
            background: isOpen ? '#DF82A3' : 'rgba(255,255,255,0.8)',
            color: isOpen ? '#fff' : '#917264',
            border: '1.5px solid #DF82A3',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            fontWeight: '700',
            fontFamily: "'Cause',serif",
            transition: 'all 0.15s ease',
          }}
        >
          <SlidersHorizontal size={12} />
          <span>Sliders</span>
        </button>
      </div>

      {/* Popover / Collapsible SketchPicker */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            top: '36px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
            borderRadius: '8px',
          }}
        >
          <SketchPicker
            color={currentHex}
            onChangeComplete={handleChange}
            presetColors={presetHexes.length ? presetHexes : undefined}
            disableAlpha
            width="210px"
          />
        </div>
      )}
    </div>
  )
}
