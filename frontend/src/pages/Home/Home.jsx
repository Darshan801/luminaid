// import React from 'react'

// const Home = () => {
//     return (
//         <div className="home-page">

//         <section className="home-hero">
//             <div className="home-hero-content">
//             <p className="home-hero-eyebrow">
//                 LIGHT WHERE YOU NEED IT
//             </p>

//             <h1>
//                 Solar-powered light
//                 <br />
//                 for every adventure.
//             </h1>

//             <p className="home-hero-description">
//                 Portable, rechargeable lights designed to keep you prepared
//                 wherever life takes you.
//             </p>

//             <a href="#" className="home-hero-button">
//                 SHOP NOW
//             </a>
//             </div>
//         </section>

//         </div>
//     )
// }

// export default Home








import React from 'react'

const Home = () => {
    return (
        <div className="home-page">

        <section className="home-hero">

            <div className="home-hero-image">
            <img
                src="/hero.png"
                alt="LuminAID outdoor lighting"
            />
            </div>

            <div className="home-hero-content">

            <p className="home-hero-reviews">
                10,000+ 5-Star Reviews
            </p>

            <h1>
                Gear Up for Adventure
            </h1>

            <p>
                Light up fall nights with Power Lanterns,
                String Lights, and Outdoor Gear!
            </p>

            <a href="#" className="home-hero-button">
                SHOP BESTSELLERS
            </a>

            </div>

        </section>

        </div>
    )
}

export default Home