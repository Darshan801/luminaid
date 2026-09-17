import React from 'react'

const Footer = () => {
  return (
    <footer className="site-footer">

      <div className="footer-main">

        <div className="footer-column">
          <h3>SHOP BY COLLECTION</h3>

          <a href="#">Shop Bundles</a>
          <a href="#">Emergency Lanterns</a>
          <a href="#">Camping Lanterns</a>
          <a href="#">Gift Guide</a>
          <a href="#">Corporate Gifts</a>
        </div>

        <div className="footer-column">
          <h3>QUICK LINKS</h3>

          <a href="#">Lumen Rewards</a>
          <a href="#">Getting Started</a>
          <a href="#">Reviews</a>
          <a href="#">Press Kit</a>
          <a href="#">Accessibility</a>
        </div>

        <div className="footer-column footer-newsletter">
          <h3>JOIN OUR EMAIL LIST</h3>

          <p>
            Get notified of upcoming sales and new product launches.
          </p>

          <form className="newsletter-form">
            <input
              type="email"
              placeholder="Your e-mail"
              aria-label="Your e-mail"
            />

            <button type="submit">
              →
            </button>
          </form>
        </div>

        <div className="footer-column">
          <h3>PARTNER WITH US</h3>

          <a href="#">Corporate Gifting</a>
          <a href="#">Nonprofit Subsidy Program</a>
          <a href="#">Affiliate Program</a>
          <a href="#">More Ways To Partner</a>
        </div>

      </div>

      <div className="footer-bottom">

        <div className="footer-legal">
          <a href="#">Terms of Service</a>
          <a href="#">Accessibility</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Shipping</a>
          <a href="#">Patents</a>
        </div>

        <div className="footer-copyright">
          <p>© 2026 LuminAID Lab LLC</p>
          <p>944 Industrial Park Rd.</p>
          <p>Littleton, NH 03561</p>
        </div>

        <div className="footer-payment">
          <p>We accept</p>
        </div>

      </div>

    </footer>
  )
}

export default Footer