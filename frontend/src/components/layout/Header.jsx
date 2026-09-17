import React from 'react'

const Header = () => {
  return (
    <header className="site-header">
      <div className="header-container">

        <a href="/" className="header-logo">
          LuminAID
        </a>

        <nav className="main-navigation">

          <div className="nav-item">
            <button className="nav-link">
              SHOP
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <a href="#">Shop All Products</a>
              <a href="#">Shop Power Lanterns</a>
              <a href="#">Shop Accessories</a>
              <a href="#">Shop the Gift Guide</a>
            </div>
          </div>

          <div className="nav-item">
            <button className="nav-link">
              BUNDLES
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <a href="#">Titan 4-Pack</a>
              <a href="#">Solar String Light 4-Pack</a>
              <a href="#">The Backyard Bundle</a>
              <a href="#">Find Your LuminAID: Take the Quiz</a>
            </div>
          </div>

          <div className="nav-item">
            <button className="nav-link">
              OUR STORY
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <a href="#">About LuminAID</a>
              <a href="#">Give Light</a>
            </div>
          </div>

          <div className="nav-item">
            <button className="nav-link">
              SUPPORT
              <span className="dropdown-arrow"></span>
            </button>

            <div className="dropdown-menu">
              <a href="#">Shipping</a>
              <a href="#">Getting Started Guides</a>
              <a href="#">Returns & Warranty</a>
              <a href="#">Accessibility</a>
              <a href="#">Contact Us</a>
            </div>
          </div>

        </nav>

        <div className="header-actions">

          <button className="header-action" aria-label="Account">
            Account
          </button>

          <button className="header-action" aria-label="Search">
            Search
          </button>

          <button className="header-action" aria-label="Cart">
            Cart
          </button>

        </div>

      </div>
    </header>
  )
}

export default Header