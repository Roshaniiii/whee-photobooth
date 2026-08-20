import { useState } from 'react'
import { ChevronDown, Camera, Heart, HelpCircle, Palette, Layers } from 'lucide-react'

export default function HomeGuideSection() {
  const [openSections, setOpenSections] = useState({
    howToUse: false,
    features: false,
    faq: true, // open by default for helpful user experience
    koreanStyle: false,
    y2kStyle: false,
  })

  const toggle = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const sectionCard = {
    background: 'rgba(255, 255, 255, 0.55)',
    border: '1px solid rgba(145, 114, 100, 0.2)',
    borderRadius: '16px',
    padding: '16px 20px',
    boxShadow: '0 4px 14px rgba(145, 114, 100, 0.08)',
    transition: 'all 0.2s ease',
  }

  const summaryBtn = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    fontFamily: "'Cause', serif",
    fontSize: 'clamp(14px, 2.2vw, 17px)',
    fontWeight: '700',
    color: '#917264',
    textAlign: 'left',
    letterSpacing: '0.4px',
  }

  const contentBody = {
    marginTop: '14px',
    paddingTop: '12px',
    borderTop: '1px solid rgba(145, 114, 100, 0.12)',
    fontFamily: "'Cause', serif",
    fontSize: '14px',
    lineHeight: '1.75',
    color: '#917264',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }

  return (
    <section className="home-guide-container" style={{
      width: '100%',
      maxWidth: '920px',
      margin: '24px auto 0',
      padding: '0 16px 36px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>

      {/* Intro Card */}
      <div style={sectionCard}>
        <div style={{ marginBottom: '8px' }}>
          <h2 style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(17px, 2.6vw, 22px)',
            color: '#DF82A3',
            margin: 0,
            letterSpacing: '0.5px',
          }}>
            Free Online Photobooth — No App, No Sign-up Required
          </h2>
        </div>
        <p style={{
          fontFamily: "'Cause', serif",
          fontSize: '14px',
          lineHeight: '1.75',
          color: '#917264',
          margin: 0,
        }}>
          Whee! Photobooth is a fun, lightweight virtual photobooth that runs directly in your web browser. Snap cute photo strips with webcam filters, choose from customizable multi-cut layouts, doodle with glow pens, and download instant high-resolution PNG printouts with zero watermarks.
        </p>
      </div>

      {/* How To Use Accordion */}
      <div style={sectionCard}>
        <button type="button" onClick={() => toggle('howToUse')} style={summaryBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="#DF82A3" />
            How to Use Whee! Photobooth
          </span>
          <ChevronDown
            size={18}
            color="#DF82A3"
            style={{
              transform: openSections.howToUse ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {openSections.howToUse && (
          <div style={contentBody}>
            <p>
              Creating your custom photo strip takes less than two minutes from start to finish:
            </p>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(145,114,100,0.12)' }}>
                <strong style={{ color: '#DF82A3' }}>1. Pick Your Layout:</strong> Choose between classic 4-cut vertical strips, polaroid frames, side-by-side duos, or create custom color borders.
              </div>
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(145,114,100,0.12)' }}>
                <strong style={{ color: '#DF82A3' }}>2. Pose with Live Filters:</strong> Allow camera access or upload your own photos. Pick real-time AR face filters (blush marks, cute cat ears) or retro CSS filters (vintage grain, rose gold, soft pastel).
              </div>
              <div style={{ background: 'rgba(255,255,255,0.6)', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(145,114,100,0.12)' }}>
                <strong style={{ color: '#DF82A3' }}>3. Doodling &amp; Stickers:</strong> On the Customise page, drop adorable Y2K stickers, draw with glow pens, or add personalized captions before downloading your high-res PNG.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Accordion */}
      <div style={sectionCard}>
        <button type="button" onClick={() => toggle('features')} style={summaryBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#DF82A3" />
            Features &amp; Highlights
          </span>
          <ChevronDown
            size={18}
            color="#DF82A3"
            style={{
              transform: openSections.features ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {openSections.features && (
          <div style={contentBody}>
            <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>100% Free &amp; Private:</strong> All processing is done locally inside your browser; captured images are never uploaded or saved on external servers.</li>
              <li><strong>Versatile Templates:</strong> Authentic Korean 4-cut formats, vintage Polaroid frames, wide 2-shot strips, and custom grid borders.</li>
              <li><strong>Live AR &amp; Color Filters:</strong> Real-time blush, cat ear face tracking, 90s vintage film grain, high-contrast monochrome, and dreamy pastels.</li>
              <li><strong>Creative Toolkit:</strong> Glow pen, eraser, color picker, text tools, and 30+ cute aesthetic stickers.</li>
              <li><strong>Universal Compatibility:</strong> Works seamlessly across iPhones, Android phones, iPads, tablets, MacBooks, and Windows laptops.</li>
            </ul>
          </div>
        )}
      </div>

      {/* FAQ Accordion */}
      <div style={sectionCard}>
        <button type="button" onClick={() => toggle('faq')} style={summaryBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} color="#DF82A3" />
            Frequently Asked Questions
          </span>
          <ChevronDown
            size={18}
            color="#DF82A3"
            style={{
              transform: openSections.faq ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {openSections.faq && (
          <div style={contentBody}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#DF82A3' }}>Is Whee! Photobooth really free?</h3>
              <p style={{ margin: 0 }}>Yes, Whee! is 100% free with no subscriptions, paid paywalls, or watermarks. You can snap and download as many strips as you like.</p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#DF82A3' }}>Does it work on mobile phones and tablets?</h3>
              <p style={{ margin: 0 }}>Yes! Open <a href="https://wheephotobooth.site" style={{ color: '#DF82A3' }}>wheephotobooth.site</a> in Safari (iOS) or Chrome (Android) and you can take photos using your front or rear cameras without downloading any apps.</p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#DF82A3' }}>Can I upload photos instead of using my webcam?</h3>
              <p style={{ margin: 0 }}>Yes, on the camera step simply tap the Upload button to pick pictures directly from your device photo gallery.</p>
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '15px', color: '#DF82A3' }}>Are my photos stored on your servers?</h3>
              <p style={{ margin: 0 }}>No. We respect user privacy. All photo capturing, filtering, and sticker processing takes place strictly inside your local web browser session.</p>
            </div>
          </div>
        )}
      </div>

      {/* Korean Photobooth Trend Guide */}
      <div style={sectionCard}>
        <button type="button" onClick={() => toggle('koreanStyle')} style={summaryBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="#DF82A3" />
            Korean 4-Cut Photobooth Style Explained
          </span>
          <ChevronDown
            size={18}
            color="#DF82A3"
            style={{
              transform: openSections.koreanStyle ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {openSections.koreanStyle && (
          <div style={contentBody}>
            <p>
              Popularized by Korean self-photo studios like Life4Cuts, the 4-cut trend emphasizes clean solid-colored frame borders, bright studio lighting, and fun sequential poses with friends. Whee brings this authentic studio experience online with built-in countdown timers and soft beauty filters so you can create aesthetic memory strips at home.
            </p>
          </div>
        )}
      </div>

      {/* Retro Y2K Aesthetic Guide */}
      <div style={sectionCard}>
        <button type="button" onClick={() => toggle('y2kStyle')} style={summaryBtn}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={18} color="#DF82A3" />
            Vintage &amp; Y2K Retro Aesthetics
          </span>
          <ChevronDown
            size={18}
            color="#DF82A3"
            style={{
              transform: openSections.y2kStyle ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>

        {openSections.y2kStyle && (
          <div style={contentBody}>
            <p>
              Inspired by 90s disposable cameras and 2000s cyber aesthetics, Whee features vintage grain filters, soft glow overlays, and playful pastel sticker collections. Print your finished strips on photo paper to make DIY phone case inserts, journal keepsakes, or wall decor.
            </p>
          </div>
        )}
      </div>

    </section>
  )
}
