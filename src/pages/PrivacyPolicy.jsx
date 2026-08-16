import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { playClick } from '../utils/sounds'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="page-wrapper privacy-policy-wrapper" style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#f2e7b4',
      position: 'relative',
      overflowX: 'hidden',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <VerticalStripes />

      {/* Content */}
      <div className="page-content privacy-page-content" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '900px',
        padding: '56px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
      }}>

        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <h1 style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(28px, 4.8vw, 38px)',
            color: '#DF82A3',
            margin: '0 0 8px 0',
            letterSpacing: '0.5px',
          }}>
            Privacy Policy
          </h1>
        </div>

        <div style={{
          width: '100%',
          padding: '24px',
          border: '1px solid rgba(145,114,100,0.16)',
          borderRadius: '18px',
          background: 'rgba(255,255,255,0.5)',
          boxShadow: '0 8px 20px rgba(145,114,100,0.08)',
        }}>
          <div style={{
            width: '100%',
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#917264',
            fontFamily: "'Cause', serif",
          }}>
            <p style={{ marginBottom: '10px', fontWeight: '600' }}>
              <strong>Last Updated:</strong> August 10, 2026
            </p>

            <p style={{ marginBottom: '16px' }}>
              At Whee! Photobooth, accessible from <a href="https://wheephotobooth.site" target="_blank" rel="noopener noreferrer" style={{ color: '#DF82A3', textDecoration: 'none' }}>https://wheephotobooth.site</a>, the privacy of our visitors is one of our main priorities. This Privacy Policy document outlines the types of information collected and recorded by Whee! Photobooth and exactly how we protect and handle it.
            </p>

            <p style={{ marginBottom: '24px' }}>
              By using our website, you hereby consent to our Privacy Policy and agree to its terms.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              1. Camera Access and Image Processing Disclosure
            </h2>

            <p style={{ marginBottom: '12px' }}>
              Whee! Photobooth is a free online photobooth and virtual photo booth app that operates directly within your web browser. To deliver our core interactive features, our application requires explicit hardware permission to access your device’s built-in camera or webcam.
            </p>

            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Local, Client-Side Processing:</strong> All camera data streams, countdown captures, filter rendering (including CSS filters like grayscale and rose gold), and photo strip creation happen entirely locally inside your web browser.</li>
              <li style={{ marginBottom: '10px' }}><strong>No Server Storage:</strong> We do not upload, collect, monitor, or save your captured image files, video streams, or photos on our external web servers. Once you close your browser tab or complete your download, all temporary visual cache data is permanently erased.</li>
              <li style={{ marginBottom: '10px' }}><strong>Photo Upload Alternative:</strong> For users utilizing our platform without a webcam by uploading a photo directly from their device, these image files are also processed strictly client-side to build the photo strip template and are never saved or retained by us.</li>
            </ul>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              2. Augmented Reality (AR) and Face Detection Data
            </h2>

            <p style={{ marginBottom: '12px' }}>
              Our platform features live AR filters (such as blush marks, cat ears, and hearts) that utilize real-time face detection scripts directly inside your web browser.
            </p>

            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px' }}><strong>Zero Biometric Collection:</strong> This automated script only tracks temporary coordinate data points on your face layout to overlay the emoji stickers or digital masks accurately while your camera is active.</li>
              <li style={{ marginBottom: '10px' }}><strong>No Face Data Retention:</strong> This face detection data is never recorded, never stored, and never shared with third parties. It is processed in real time and vanishes instantly the moment you turn off the filter or exit the browser.</li>
            </ul>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              3. Log Files
            </h2>

            <p style={{ marginBottom: '16px' }}>
              Whee! Photobooth follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamps, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering broad demographic information.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              4. Cookies and Web Beacons
            </h2>

            <p style={{ marginBottom: '16px' }}>
              Like any other modern web platform, Whee! Photobooth uses "cookies". These cookies are used to store information including visitors' preferences, and the specific pages on the website that the visitor accessed or visited. This information is utilized to optimize the user experience by customizing our web page content based on visitors' browser types and other non-identifiable technical metrics.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              5. Google DoubleClick DART Cookie & Advertising Partners
            </h2>

            <p style={{ marginBottom: '12px' }}>
              Google is one of the third-party vendors utilized on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to wheephotobooth.site and other domains across the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
            </p>

            <p style={{ marginBottom: '12px' }}>- google.com</p>

            <p style={{ marginBottom: '16px' }}>
              Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Whee! Photobooth, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Please note that Whee! Photobooth has no access to or control over these cookies that are used by third-party advertisers.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              6. Third-Party Privacy Policies
            </h2>

            <p style={{ marginBottom: '16px' }}>
              Whee! Photobooth's Privacy Policy does not apply to other advertisers or external websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information regarding their deployment data practices and opt-out instructions. You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              7. GDPR Data Protection Rights (UK & European Users)
            </h2>

            <p style={{ marginBottom: '12px' }}>
              We want to ensure you are fully aware of all of your data protection rights. Every user is entitled to the following:
            </p>

            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px' }}><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
              <li style={{ marginBottom: '10px' }}><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
              <li style={{ marginBottom: '10px' }}><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
              <li style={{ marginBottom: '10px' }}><strong>The right to restrict/object to processing:</strong> You have the right to object to or restrict our processing of your personal data, under certain conditions.</li>
            </ul>

            <p style={{ marginBottom: '16px' }}>
              Since our webcam photo booth online tool processes no personal identity data or images on our servers, we hold no user image databases to modify or erase.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              8. CCPA Privacy Rights (California / US Users)
            </h2>

            <p style={{ marginBottom: '12px' }}>
              Under the CCPA, among other rights, California consumers have the right to:
            </p>

            <ul style={{ marginBottom: '16px', paddingLeft: '24px' }}>
              <li style={{ marginBottom: '10px' }}>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
              <li style={{ marginBottom: '10px' }}>Request that a business delete any personal data about the consumer that a business has collected.</li>
              <li style={{ marginBottom: '10px' }}>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</li>
            </ul>

            <p style={{ marginBottom: '16px' }}>
              If you make a data request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              9. Children's Information
            </h2>

            <p style={{ marginBottom: '16px' }}>
              Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. Whee! Photobooth does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
            </p>

            <h2 style={{
              fontFamily: "'Cause', serif",
              fontSize: '20px',
              color: '#DF82A3',
              margin: '22px 0 8px 0',
              letterSpacing: '0.5px',
            }}>
              10. Contact Us
            </h2>

            <p style={{ marginBottom: '24px' }}>
              If you have additional questions, require more information about our Privacy Policy, or wish to make an analytical data inquiry, please do not hesitate to contact us.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
              <button
                onClick={() => {
                  playClick()
                  navigate('/contact')
                }}
                style={{
                  fontFamily: "'Cause', serif",
                  fontSize: 'clamp(14px, 2.5vw, 18px)',
                  fontWeight: '700',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  color: '#F2E7B4',
                  background: '#DF82A3',
                  border: 'none',
                  borderRadius: '100px',
                  padding: 'clamp(10px, 1.5vw, 14px) clamp(32px, 6vw, 56px)',
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
                Contact Us
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
