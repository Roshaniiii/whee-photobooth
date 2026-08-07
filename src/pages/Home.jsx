import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { playClick } from '../utils/sounds'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

// Import all assets — copy these files into your src/assets/ folder
import frame1 from '../assets/frame_1.png'
import frame2 from '../assets/frame_2.png'
import frame3 from '../assets/frame_3.png'
import frame4 from '../assets/frame_4.png'
import frame5 from '../assets/frame_5.png'
import frame6 from '../assets/frame_6.png'

export default function Home() {
  const navigate = useNavigate()
  const [expandedSections, setExpandedSections] = useState(['how-to-use', 'faq'])

  const toggleSection = (sectionId) => {
    setExpandedSections((current) => (
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    ))
  }

  const isExpanded = (sectionId) => expandedSections.includes(sectionId)

  const sectionButtonStyle = {
    width: '100%',
    border: '1px solid rgba(145,114,100,0.2)',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.55)',
    color: '#917264',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 3px 10px rgba(145,114,100,0.08)',
  }

  const sectionContentStyle = {
    color: '#917264',
    fontFamily: "'Cause', serif",
    fontSize: '13px',
    lineHeight: 1.7,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }

  return (
    <div className="page-wrapper home-page-wrapper" style={{
      paddingTop: '52px',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f2e7b4',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      <VerticalStripes />

      {/* ── Content ── */}
      <div className="page-content home-page-content" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '1200px',
        padding: '48px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* ── Logo + Title ── */}
        <div style={{ textAlign: 'center', marginBottom: '3px' }}>
          <h1 className="home-title" style={{
            fontFamily: "'Unkempt', 'Cause', cursive",
            fontSize: 'clamp(38px, 7vw, 55px)',
            color: '#DF82A3',
            margin: 0,
            letterSpacing: '1px',
            lineHeight: 1,
          }}>
            Whee! Photobooth
          </h1>

          {/* Tagline — shifted right */}
          <p className="home-subtitle" style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(13px, 2vw, 16px)',
            color: '#917264',
            margin: '5px 0 0 0',
            letterSpacing: '0.5px',
          }}>
            Pose. Capture. Repeat.
          </p>
        </div>

        {/* ── Frames scattered layout — clustered like Image 1 ── */}
        <div className="home-frames-wrap" style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          height: 'clamp(300px, 48vw, 420px)',
          margin: '8px auto 28px',
        }}>

          {/* Frame 3 — top left, small */}
          <img className="home-frame frame-3" src={frame3} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(110px, 13vw, 130px)',
            left: '7%',
            top: '19%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 1 — top center, large — most prominent */}
          <img className="home-frame frame-1" src={frame1} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(170px, 22vw, 200px)',
            left: '45%',
            top: '1%',
            transform: 'translateX(-55%) rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
            zIndex: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-55%) rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-55%) rotate(0deg) scale(1)'}
          />

          {/* Frame 2 — top right, medium */}
          <img className="home-frame frame-6" src={frame6} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(140px, 16vw, 160px)',
            right: '15%',
            top: '13%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 3 — bottom left, medium */}
          <img className="home-frame frame-2" src={frame2} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(140px, 15vw, 150px)',
            left: '12%',
            bottom: '10%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

          {/* Frame 4 — bottom center, large */}
          <img className="home-frame frame-4" src={frame4} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(200px, 22vw, 210px)',
            left: '53%',
            bottom: '-4%',
            transform: 'translateX(-50%) rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
            zIndex: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-50%) rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(-50%) rotate(0deg) scale(1)'}
          />

          {/* Frame 6 — bottom right, small */}
          <img className="home-frame frame-5" src={frame5} alt="Photo strip template preview - Whee Photobooth" style={{
            position: 'absolute',
            width: 'clamp(120px, 13vw, 130px)',
            right: '9%',
            bottom: '14%',
            transform: 'rotate(0deg)',
            borderRadius: '16px',
            filter: 'drop-shadow(4px 6px 10px rgba(145,114,100,0.25))',
            transition: 'transform 0.3s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'rotate(0deg) scale(1.06)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg) scale(1)'}
          />

        </div>

        {/* ── START Button ── */}
        <button
          onClick={() => {
            playClick()
            navigate('/layout')
          }}
          style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(15px, 2.5vw, 20px)',
            fontWeight: '700',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            color: '#F2E7B4',
            background: '#DF82A3',
            border: 'none',
            borderRadius: '100px',
            padding: 'clamp(12px, 2vw, 16px) clamp(40px, 8vw, 72px)',
            cursor: 'pointer',
            boxShadow: '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)',
            transition: 'transform 0.12s ease, box-shadow 0.12s ease',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 5px 3px #917264, 0 10px 24px rgba(145,114,100,0.25)'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translateY(3px)'
            e.currentTarget.style.boxShadow = '0 5px 3px #917264, 0 4px 12px rgba(145,114,100,0.2)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 7px 7px #917264, 0 14px 28px rgba(145,114,100,0.3)'
          }}
        >
          Start
        </button>

        <div style={{
          width: '100%',
          maxWidth: '920px',
          marginTop: '26px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '0 4px 8px',
        }}>
          <section id="intro" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: 'clamp(18px, 2.8vw, 24px)',
              color: '#DF82A3',
              margin: '0 0 8px',
            }}>
              Free Online Photobooth — No App, No Signup
            </h2>
            <p style={sectionContentStyle}>
              Whee! is a free online photobooth that runs entirely in your browser. No downloads, no account needed — just open the site, pick a template, and start capturing. Whether you're looking for a virtual photo booth app for fun, a webcam photo booth online for your next party, or a quick photo strip generator free of charge, Whee has everything you need in one place.
            </p>
          </section>

          <section id="how-to-use" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('how-to-use')} style={sectionButtonStyle} aria-expanded={isExpanded('how-to-use')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                How to Use Whee! Photobooth
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('how-to-use') ? '−' : '+'}</span>
            </button>
            {isExpanded('how-to-use') && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={sectionContentStyle}>
                  Using Whee is as simple as it gets. Click Start on the home page and pick your favourite photo strip template — from polaroid frames to aesthetic 4 cut layouts. Allow camera access, choose a filter, and hit capture. Whee automatically takes all your photos with a countdown timer so you have time to strike a pose. Once your strip is ready, head to the Customise page to doodle, add stickers and text, then download your finished strip instantly as a PNG. The whole process takes under two minutes.
                </p>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(145,114,100,0.16)', borderRadius: '14px', padding: '12px 13px', boxShadow: '0 3px 10px rgba(145,114,100,0.06)' }}>
                    <h3 style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 6px' }}>Step 1 — Pick Your Template</h3>
                    <p style={sectionContentStyle}>
                      Browse our growing collection of photo strip templates including polaroid printout generator styles, vintage 4 cut frames, and aesthetic photo collage templates. Each layout is designed to make your photos look stunning. New templates are added every week based on user feedback — so there is always something fresh to discover.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(145,114,100,0.16)', borderRadius: '14px', padding: '12px 13px', boxShadow: '0 3px 10px rgba(145,114,100,0.06)' }}>
                    <h3 style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 6px' }}>Step 2 — Strike a Pose with Live Filters</h3>
                    <p style={sectionContentStyle}>
                      Whee comes with a wide range of filters built right into the browser. Try vintage photo booth filter effects like grayscale, rose gold, and retro 90s photo strip styles. For something more playful, our AR-powered filters add blush marks and cat ears detected on your face in real time — making Whee one of the most feature-rich free online photo booth with filters available anywhere.
                    </p>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(145,114,100,0.16)', borderRadius: '14px', padding: '12px 13px', boxShadow: '0 3px 10px rgba(145,114,100,0.06)' }}>
                    <h3 style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 6px' }}>Step 3 — Customise Your Strip</h3>
                    <p style={sectionContentStyle}>
                      After capturing your photos head to the Customise page. Draw on your strip with pen or glow tools, add colourful text, drop emoji stickers anywhere you like, and make your strip completely yours. When you are happy with the result, download it as a high quality PNG — completely free with no watermark.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section id="features" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('features')} style={sectionButtonStyle} aria-expanded={isExpanded('features')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Everything You Get — Completely Free
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('features') ? '−' : '+'}</span>
            </button>
            {isExpanded('features') && (
              <div style={{ marginTop: '10px' }}>
                <p style={sectionContentStyle}>
                  Whee! Photobooth is packed with features that most paid tools charge for. Here is everything included at zero cost:
                </p>
                <ul style={{ margin: '0', paddingLeft: '18px', color: '#917264', fontSize: '13px', lineHeight: 1.7 }}>
                  <li>Free online photo booth with filters — no subscription</li>
                  <li>Multiple photo strip templates including 4 cut, duo, trio and solo layouts</li>
                  <li>Korean photo booth online style with aesthetic 4 cut photos</li>
                  <li>Live AR filters — blush, cat ears and hearts powered by face detection</li>
                  <li>CSS filters — vintage, grayscale, rose gold, dreamy, sunshine and more</li>
                  <li>Drawing tools — pen, glow pen, eraser, undo and redo</li>
                  <li>Text tool — add captions in custom colours and styles</li>
                  <li>Emoji sticker drag and drop</li>
                  <li>Download as high quality PNG — instant, no watermark</li>
                  <li>Works on laptop, desktop, tablet and mobile</li>
                  <li>No account required — open and go</li>
                </ul>
              </div>
            )}
          </section>

          <section id="faq" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('faq')} style={sectionButtonStyle} aria-expanded={isExpanded('faq')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Frequently Asked Questions
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('faq') ? '−' : '+'}</span>
            </button>
            {isExpanded('faq') && (
              <div style={{ marginTop: '10px' }} itemscope itemType="https://schema.org/FAQPage">
                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '8px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>Is Whee! Photobooth really free?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Yes — completely free. No hidden fees, no watermarks, no subscription required. You can use Whee as many times as you want and download as many photo strips as you like at zero cost.</p>
                  </div>
                </div>

                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '10px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>How do I make a photo booth strip online?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Open wheephotobooth.site, click Start, pick a template, allow camera access, choose a filter and hit capture. Whee automatically takes all your photos and builds your strip. Customise it and download — done in under two minutes.</p>
                  </div>
                </div>

                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '10px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>Does Whee work on iPhone and Android?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Yes! Whee works on any device with a camera and a modern browser. iPhone users should use Safari or Chrome, Android users can use Chrome. No app download needed — just open the website.</p>
                  </div>
                </div>

                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '10px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>Can I use Whee for Korean style 4 cut photos?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Absolutely! Whee has multiple 4 cut photo template layouts inspired by Korean photo booths like Life4Cuts. Choose a 4-shot template, apply a soft aesthetic filter, and download your korean photostrip maker result instantly.</p>
                  </div>
                </div>

                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '10px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>What filters does Whee have?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Whee has CSS-based filters including vintage, grayscale, rose gold, dreamy, sunshine, pink glow, blue glow, green glow and more. It also has AR filters like blush, cat ears and hearts powered by real-time face detection. New filters are added regularly based on user requests.</p>
                  </div>
                </div>

                <div itemscope itemProp="mainEntity" itemType="https://schema.org/Question" style={{ paddingTop: '10px' }}>
                  <h3 itemProp="name" style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0 0 4px' }}>Can I use Whee without a webcam?</h3>
                  <div itemscope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p itemProp="text" style={sectionContentStyle}>Yes! You can upload a photo from your device instead of using a webcam. Tap the upload button on the camera page, select your photo, and it will be used for your strip just like a captured photo.</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section id="korean-photo-booth" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('korean-photo-booth')} style={sectionButtonStyle} aria-expanded={isExpanded('korean-photo-booth')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Korean Photo Booth Online — 4 Cut Photos Made Easy
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('korean-photo-booth') ? '−' : '+'}</span>
            </button>
            {isExpanded('korean-photo-booth') && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={sectionContentStyle}>Inspired by the iconic Life4Cuts and Korean photo studio filter online booths, Whee brings the authentic korean photo booth online experience straight to your browser. Create beautiful 4 cut photo templates with soft aesthetic filters that capture the warm, dreamy look of Korean photo studios — without leaving your home. Perfect for recreating korean photo booth poses with your friends, making aesthetic 4 cut photos for Instagram, or simply capturing a cute moment with the people you love.</p>
                <h3 style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0' }}>Top Korean Photo Booth Poses to Try</h3>
                <p style={sectionContentStyle}>Not sure how to pose? Here are some classic korean photo booth poses that always look great on a 4 cut photostrip — the peace sign, the cheek squish, back to back with a friend, candid laughing shots, and the classic straight face aesthetic. Mix and match across your four frames for a strip that tells a story. Use our korean photostrip maker to capture all four shots automatically with a countdown timer so nobody misses the moment.</p>
              </div>
            )}
          </section>

          <section id="y2k-retro" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('y2k-retro')} style={sectionButtonStyle} aria-expanded={isExpanded('y2k-retro')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Y2K Camera Filter Online — Retro Aesthetic Photo Strips
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('y2k-retro') ? '−' : '+'}</span>
            </button>
            {isExpanded('y2k-retro') && (
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={sectionContentStyle}>Obsessed with the 90s look web camera aesthetic? Whee's retro and Y2K-inspired filters bring that grainy, washed-out, nostalgic feel to your photo strips. From black and white photo booth online effects to warm vintage tones and high contrast retro 90s photo strip styles, every filter is designed to make your photos look like they were taken on a disposable camera from another era. Gen Z and Millennial users love using Whee as their go-to y2k camera filter online tool for TikTok content, Instagram posts and aesthetic photo collage templates.</p>
                <h3 style={{ fontFamily: "'Cause', serif", fontSize: '15px', color: '#DF82A3', margin: '0' }}>Polaroid Printout Generator and Vintage Frames</h3>
                <p style={sectionContentStyle}>Whee's polaroid-style templates let you create that classic instant camera look without any physical film. Choose a vintage 4 cut frame, capture your photos, and download a strip that looks like it came straight out of a 1990s photo booth. Add a handwritten-style caption using our text tool and your polaroid printout generator strip is ready to share anywhere.</p>
              </div>
            )}
          </section>

          <section id="why-whee" style={{
            background: 'rgba(255,255,255,0.42)',
            border: '1px solid rgba(145,114,100,0.16)',
            borderRadius: '18px',
            padding: '14px 16px',
            boxShadow: '0 8px 18px rgba(145,114,100,0.08)',
          }}>
            <button type="button" onClick={() => toggleSection('why-whee')} style={sectionButtonStyle} aria-expanded={isExpanded('why-whee')}>
              <span style={{ fontFamily: "'Cause', serif", fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Why Thousands of People Choose Whee! Photobooth
              </span>
              <span style={{ fontSize: '16px', color: '#DF82A3' }}>{isExpanded('why-whee') ? '−' : '+'}</span>
            </button>
            {isExpanded('why-whee') && (
              <div style={{ marginTop: '10px' }}>
                <p style={sectionContentStyle}>Unlike other pc photobooth tool options that require software downloads or expensive subscriptions, Whee is completely free and works instantly on any device with a camera. Laptop, desktop, tablet or phone — if it has a webcam it works with Whee. As a take photo strips online platform built for everyone, Whee is used by students, content creators, party hosts, K-Pop fans, and everyday users across the USA, Philippines, India and beyond. Over 45,000 people use Whee every month and that number keeps growing — because when something is free, fun and just works, people keep coming back.</p>
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />

    </div>
  )
}