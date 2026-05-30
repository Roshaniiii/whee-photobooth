export default function VerticalStripes() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ flex: 1, borderRight: '5px solid #917264', opacity: 0.20 }} />
      ))}
    </div>
  )
}
