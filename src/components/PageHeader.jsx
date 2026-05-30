import BackButton from './BackButton'

export const PAGE_TITLE_STYLE = {
  fontFamily: "'Unkempt',cursive",
  fontSize: 'clamp(26px, 5vw, 36px)',
  color: '#DF82A3',
  margin: '8px 0 0',
  letterSpacing: '2px',
  textAlign: 'center',
  lineHeight: 1.1,
}

export default function PageHeader({ onBack, title }) {
  return (
    <div style={{
      width: '100%',
      position: 'relative',
      flexShrink: 0,
      paddingTop: '10px',
      marginBottom: '8px',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
        <BackButton onClick={onBack} />
      </div>
      <h1 style={PAGE_TITLE_STYLE}>{title}</h1>
    </div>
  )
}
