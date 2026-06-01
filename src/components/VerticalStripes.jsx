export default function VerticalStripes() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      backgroundImage: `repeating-linear-gradient(
        90deg,
        rgba(145, 114, 100, 0.20) 0px,
        rgba(145, 114, 100, 0.20) 10px,
        transparent 10px,
        transparent 60px
      )`,
    }} />
  )
}
