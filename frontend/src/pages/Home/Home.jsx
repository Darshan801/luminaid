import React from 'react'
// import heroImage from '../../assets/hero.png'

const Home = () => {
    return (
        <div className="home-page">

        <section className="home-hero">

            {/* <img
            className="home-hero-image"
            src={heroImage}
            alt="LuminAID outdoor lighting"
            /> */}

            <div className="home-hero-overlay">

            <div className="home-hero-content">

                <p className="home-hero-reviews">
                10,000+ 5-Star Reviews
                </p>

                <h1>
                Gear Up for Adventure
                </h1>

                <p className="home-hero-description">
                Light up fall nights with Power Lanterns,
                String Lights, and Outdoor Gear!
                </p>

                <a href="#" className="home-hero-button">
                SHOP BESTSELLERS
                </a>

            </div>

            </div>

        </section>

        </div>
    )
}

export default Home