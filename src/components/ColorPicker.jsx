import React, { useRef } from 'react'
import { Pipette } from 'lucide-react'

export default function ColorPicker({
  value,
  onChange,
  presets = [],
  compact = false,
}) {
  const inputRef = useRef(null)

  // Standardize presets array into objects { hex, label }
  const normalizedPresets = presets.map((p) => {
    if (typeof p === 'string') {
      return { hex: p, label: p, id: p }
    }
    return p
  })

  // Normalize current selected hex value
  const currentHex = typeof value === 'string' ? value : value?.hex || '#000000'

  const handleCustomChange = (e) => {
    const hex = e.target.value
    const matchedPreset = normalizedPresets.find(
      (p) => p.hex.toLowerCase() === hex.toLowerCase()
    )
    onChange(hex, matchedPreset || { id: 'custom', label: 'Custom', hex })
  }

  const handleSelectPreset = (p) => {
    onChange(p.hex, p)
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', maxWidth: '80px' }}>
          {normalizedPresets.map((p) => {
            const isSelected = currentHex.toLowerCase() === p.hex.toLowerCase()
            return (
              <button
                key={p.id || p.hex}
                type="button"
                aria-label={`Color ${p.label || p.hex}`}
                onClick={() => handleSelectPreset(p)}
                style={{
                  width: isSelected ? 16 : 12,
                  height: isSelected ? 16 : 12,
                  borderRadius: '50%',
                  background: p.hex,
                  border: isSelected ? '2px solid #DF82A3' : '1px solid rgba(145,114,100,0.25)',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              />
            )
          })}
          {/* Custom color picker input */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              type="button"
              title="Pick custom color"
              onClick={() => inputRef.current?.click()}
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                border: '1px solid rgba(145,114,100,0.3)',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
            <input
              ref={inputRef}
              type="color"
              value={currentHex}
              onChange={handleCustomChange}
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '400px' }}>
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
                gap: '2px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: p.hex,
                  border: isSelected ? '3px solid #917264' : '3px solid transparent',
                  boxShadow: isSelected ? '0 0 0 2px rgba(145,114,100,0.35)' : '0 2px 5px rgba(0,0,0,0.08)',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s, box-shadow 0.2s, border 0.2s',
                }}
              />
              <span
                style={{
                  fontSize: '8px',
                  color: '#917264',
                  fontWeight: isSelected ? '700' : '400',
                  maxWidth: '36px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.label}
              </span>
            </div>
          )
        })}

        {/* Custom color picker swatch */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
              border: '3px solid transparent',
              boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Pipette size={14} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />
          </div>
          <span style={{ fontSize: '8px', color: '#917264', fontWeight: '500' }}>Custom</span>
          <input
            ref={inputRef}
            type="color"
            value={currentHex}
            onChange={handleCustomChange}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
