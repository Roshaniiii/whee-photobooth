import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import VerticalStripes from '../components/VerticalStripes'
import Footer from '../components/Footer'

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div className="page-wrapper terms-page-wrapper" style={{
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

      <div className="page-content terms-page-content" style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '900px',
        padding: '56px 24px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '18px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{
            fontFamily: "'Cause', serif",
            fontSize: 'clamp(28px, 4.8vw, 38px)',
            color: '#DF82A3',
            margin: '0 0 8px',
            letterSpacing: '0.5px',
          }}>
            Terms of Service
          </h1>
          <p style={{
            fontFamily: "'Cause', serif",
            fontSize: '13px',
            color: '#917264',
            margin: 0,
            opacity: 0.9,
          }}>
            Last Updated: August 10, 2026
          </p>
        </div>

        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(145,114,100,0.16)',
          borderRadius: '18px',
          padding: '24px',
          boxShadow: '0 8px 20px rgba(145,114,100,0.08)',
          color: '#917264',
          fontSize: '15px',
          lineHeight: 1.8,
          fontFamily: "'Cause', serif",
        }}>
          <p>
            Welcome to Whee! Photobooth (accessible from <a href="https://wheephotobooth.site" target="_blank" rel="noopener noreferrer" style={{ color: '#DF82A3' }}>https://wheephotobooth.site</a>). These Terms of Service (&quot;Terms&quot;) govern your access to and use of our website, tools, digital photobooth application, and any premium features or services offered. By accessing or using Whee! Photobooth, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you are prohibited from using our site.
          </p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>1. Description of Service</h2>
          <p>
            Whee! Photobooth provides users with a free, browser-based interactive online photobooth application. Our service allows users to:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li>Access their device camera or upload photos from their device</li>
            <li>Apply live CSS-based aesthetic filters including vintage, grayscale, rose gold, dreamy, sunshine, pink glow, blue glow, green glow and more</li>
            <li>Apply real-time AR-powered filters including blush marks, cat ears and hearts using face detection technology</li>
            <li>Choose from multiple digital photo strip templates including solo, duo, trio and 4-cut layouts</li>
            <li>Build custom layouts with personalised frame colors</li>
            <li>Customise photo strips using drawing tools, text, emoji stickers and glow effects</li>
            <li>Download completed photo strips as high quality PNG files</li>
            <li>Access premium paid templates through our Premium Templates section (where available)</li>
          </ul>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>2. User License and Image Ownership</h2>
          <p><strong>Your Photos:</strong> Whee! Photobooth does not claim any ownership rights over the photographs you take or upload using our platform. You retain full copyright and ownership of any images you capture, upload, and download.</p>
          <p><strong>Personal Use:</strong> You are granted a non-exclusive, non-transferable, revocable license to use our generated photo strips for personal, non-commercial purposes including sharing on social media, printing for personal use, scrapbooking, or room decoration.</p>
          <p><strong>Commercial Restrictions:</strong> You may not use our proprietary digital assets, trademarked frame layouts, template designs, filter effects, or underlying software code for commercial profit or resale without explicit written consent from the site administration.</p>
          <p><strong>User Generated Content:</strong> Any content you create using Whee! Photobooth including drawn annotations, added text, and customised strips remains your own. You are solely responsible for ensuring the content you create does not infringe on any third party rights.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>3. Hardware Access and Privacy</h2>
          <p>To provide our core service, the application requires temporary hardware permission to access your device&apos;s built-in camera or accept uploaded images from your device. By granting camera access or uploading images, you understand and agree that:</p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li>Camera processing occurs entirely locally inside your browser window for CSS filters and canvas-based operations</li>
            <li>Backend AR filter processing (blush, cat ears, hearts) requires your image to be temporarily transmitted to our secure API server for processing — this transmission is encrypted via HTTPS and the image is not stored or retained after processing</li>
            <li>No imagery data is permanently stored on our servers</li>
            <li>Downloaded photo strips are saved directly to your device and are not retained by us</li>
            <li>Session data including captured photos is stored temporarily in your browser&apos;s sessionStorage and is automatically cleared when you close the tab</li>
          </ul>
          <p>Please review our <Link to="/privacy-policy" style={{ color: '#DF82A3' }}>Privacy Policy</Link> for full details on how cookies, analytics tools such as Google Analytics, and advertising networks are utilised on this platform.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>4. Premium Features and Payments</h2>
          <p>Whee! Photobooth offers optional paid premium template packs and features. By purchasing any premium feature you agree that:</p>
          <p><strong>Payments:</strong> All payments are processed securely through Razorpay. Whee! Photobooth does not store your card details or payment credentials at any point. Payment processing is subject to Razorpay&apos;s own Terms of Service and Privacy Policy.</p>
          <p><strong>One Time Purchase:</strong> Premium template purchases are one-time payments that grant you lifetime access to the purchased templates tied to your account. Purchased templates do not expire.</p>
          <p><strong>No Refunds:</strong> Due to the digital nature of our products, all sales are final. We do not offer refunds on purchased premium templates or digital products once access has been granted. If you experience a technical issue preventing access to a purchased template, please contact us at <a href="mailto:wheephotobooth@gmail.com" style={{ color: '#DF82A3' }}>wheephotobooth@gmail.com</a> and we will resolve it promptly.</p>
          <p><strong>Account Required:</strong> Accessing premium features requires creating a Whee! account using a valid email address or Google account via Supabase authentication. You are responsible for maintaining the confidentiality of your account credentials.</p>
          <p><strong>Currency:</strong> Payments are processed in Indian Rupees (INR) by default. International card payments are accepted and currency conversion is handled by your card issuer.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>5. User Accounts</h2>
          <p>If you create an account on Whee! Photobooth you agree to:</p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account password</li>
            <li>Notify us immediately of any unauthorised use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>6. Acceptable Conduct</h2>
          <p>By using Whee! Photobooth you agree not to:</p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li>Use the application to create, generate, or download content that is illegal, defamatory, harmful, sexually explicit, or offensive</li>
            <li>Upload images of other individuals without their explicit consent</li>
            <li>Attempt to reverse-engineer, exploit, hack, or disrupt the software scripts and underlying code running on wheephotobooth.site or our backend API</li>
            <li>Deploy automated bots, web scrapers, or scripts to systematically download our assets or flood our servers with traffic</li>
            <li>Attempt to circumvent our rate limiting, payment systems, or account verification processes</li>
            <li>Use our platform to infringe on the intellectual property rights of any third party</li>
            <li>Share, resell, or distribute purchased premium templates to individuals who have not purchased them</li>
          </ul>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>7. Third Party Services</h2>
          <p>Whee! Photobooth integrates with the following third party services. Your use of our platform is also subject to their respective terms and policies:</p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li><strong>Google Analytics</strong> — for anonymous usage analytics</li>
            <li><strong>Razorpay</strong> — for payment processing</li>
            <li><strong>Supabase</strong> — for user authentication and purchase records</li>
            <li><strong>Tally.so</strong> — for optional feedback collection</li>
            <li><strong>Render.com</strong> — for backend API hosting</li>
            <li><strong>Vercel / Cloudflare Pages</strong> — for frontend hosting</li>
            <li><strong>Google AdSense</strong> — for advertising (where applicable)</li>
          </ul>
          <p>We are not responsible for the practices or content of these third party services.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>8. Advertising</h2>
          <p>Whee! Photobooth may display advertisements served by Google AdSense or other advertising networks. These advertisements are clearly separate from our content and tools. We are not responsible for the content of third party advertisements displayed on our platform.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>9. Intellectual Property</h2>
          <p>All original template designs, frame artwork, interface elements, branding, logos, and the Whee! Photobooth name and tagline &quot;Pose. Capture. Repeat.&quot; are the intellectual property of Whee! Photobooth and its creator. You may not reproduce, distribute, or create derivative works from our proprietary assets without explicit written permission.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>10. Disclaimer of Warranties</h2>
          <p>Whee! Photobooth is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We make no warranties expressed or implied regarding:</p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0 0' }}>
            <li>The continuous availability or uptime of the web application</li>
            <li>The performance or compatibility of filters and templates across all devices and browsers</li>
            <li>The speed or quality of AR filter processing via our backend API</li>
            <li>The permanent availability of any free features which may be modified or discontinued at any time</li>
          </ul>
          <p>We do not guarantee that our filters or templates will appear identical across all smartphone, tablet, or desktop hardware configurations. Technical issues, camera compatibility errors, or browser conflicts may temporarily affect service.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>11. Limitation of Liability</h2>
          <p>In no event shall Whee! Photobooth, its creators, owners, or affiliates be held liable for any direct, indirect, incidental, or consequential damages including without limitation damages for loss of data, hardware malfunction, loss of purchased access, or temporary loss of service arising out of the use or inability to use our platform. This limitation applies even if we have been notified of the possibility of such damage.</p>
          <p>Our total liability to you for any claim arising from your use of Whee! Photobooth shall not exceed the amount you paid for any premium feature giving rise to the claim.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>12. Changes to These Terms</h2>
          <p>We reserve the right to revise, update, or modify these Terms of Service at any time. When we make significant changes we will update the &quot;Last Updated&quot; date at the top of this page. By continuing to access and use wheephotobooth.site after amendments are published, you agree to be bound by the updated Terms.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>13. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms or your use of Whee! Photobooth shall be subject to the exclusive jurisdiction of the courts located in India.</p>

          <h2 style={{ fontFamily: "'Cause', serif", fontSize: '20px', color: '#DF82A3', margin: '22px 0 8px' }}>14. Contact Information</h2>
          <p>If you have any questions, complaints, technical issues, or legal inquiries regarding these Terms of Service please contact us at:</p>
          <p><strong>Email:</strong> <a href="mailto:wheephotobooth@gmail.com" style={{ color: '#DF82A3' }}>wheephotobooth@gmail.com</a></p>
          <p><strong>Website:</strong> <a href="https://wheephotobooth.site" target="_blank" rel="noopener noreferrer" style={{ color: '#DF82A3' }}>https://wheephotobooth.site</a></p>
          <p>We aim to respond to all inquiries within 48 hours.</p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
