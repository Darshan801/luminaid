import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const AboutPage = () => {
  // Image paths from public folder
  const foundersImage = '/images/about/Founders_As_Seen_on_Shark_Tank_613x.jpg';
  const foundersGivingImage = '/images/about/Homepage_Our_Founders_1400x.png';
  const giveLightImage = '/images/about/Give_Light_IMage_600x_600x_ecd10507-0713-4923-8679-9b4659179ffe_600x.jpg';
  const outdoorImage = '/images/about/Consumer_Use_Cases_600x_600x_74f78713-261e-4a82-81cc-b35f6283092b_600x.jpg';
  const sharkTankImage = '/images/about/Picture1_600x_8b4d638f-6acf-4054-897f-c36d22e09cde_600x.png';
  const crowdfundingImage = '/images/about/Crowdfunding_Image_600x_600x_db9b920c-daf8-4c06-bb3d-aa6e64769622_600x.jpg';

  return (
    <div className="w-full bg-warm-paper">

      {/* Breadcrumb */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium">About LuminAID</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-orange-50 via-warm-paper to-red-50 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-6">
            About LuminAID
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Bringing safe, sustainable light to communities around the world
          </p>
        </div>
      </section>


      {/* Our Mission */}
      <section className="w-full py-16 md:py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            
            {/* Left - Image */}
            <div className="overflow-hidden rounded-soft shadow-medium">
              <img
                src={foundersImage}
                alt="As Seen on Shark Tank: LuminAID's Founders Anna Stork and Andrea Sreshta with a Power Lantern Prototype"
                className="w-full h-auto object-cover transition-transform duration-slow hover:scale-105"
              />
            </div>

            {/* Right - Mission Statement */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 leading-tight">
                Our Mission: LuminAID seeks to make safe light and energy accessible for all.
              </h2>
            </div>

          </div>

          {/* Story Paragraphs */}
          <div className="max-w-4xl mx-auto space-y-6">

            <p className="text-lg leading-relaxed text-gray-700">
              We conceived of the LuminAID light when we were students at
              architecture school in New York City. A devastating earthquake
              had just struck Haiti, and we asked ourselves what we could
              design to help survivors of such an event. When we think of our
              most basic human needs, we often think of food, water, and
              shelter. But the stories we were hearing of the dangerous
              conditions at night in the tent cities inspired us to turn our
              attention to another critical need: light.
            </p>

            <p className="text-lg leading-relaxed text-gray-700">
              We designed an inflatable solar lantern that could pack flat to
              be cost-effectively distributed after disasters. The simple,
              rechargeable lantern is lightweight, easy to use, and serves as
              a safer alternative to hazardous candles or toxic kerosene for
              people without stable access to electricity. For ten years,
              we've worked with humanitarian partners across the world to send
              LuminAID lights to those who need them most.
            </p>

          </div>

        </div>
      </section>


      {/* Founders */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">

          <div className="overflow-hidden rounded-soft shadow-medium mb-8">
            <img
              src={foundersGivingImage}
              alt="Anna Stork and Andrea Sreshta"
              className="w-full max-w-5xl mx-auto h-auto object-cover"
            />
          </div>

          <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
            Anna Stork and Andrea Sreshta
          </h3>

          <p className="text-base md:text-lg text-gray-600">
            Inventors & Co-Founders of LuminAID
          </p>

        </div>
      </section>


      {/* Give Light, Get Light */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="overflow-hidden rounded-soft shadow-medium">
              <img
                src={giveLightImage}
                alt="Children who received LuminAID lights through the Give Light, Get Light program"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-xl">

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                GIVE LIGHT, GET LIGHT
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-6">
                We started LuminAID with a Give Light, Get Light campaign to
                send lights to Pencils of Promise, and have made it a core
                program of our company ever since.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
                By sponsoring a light through our Give Light, Get Light
                program, supporters earmark a solar lantern or phone charger
                for the cause of their choice. We then send the lights to our
                humanitarian partners who distribute them to families in
                need.
              </p>

              <Link
                to="/give-light"
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-soft
                         text-sm font-bold tracking-wide uppercase
                         hover:bg-brand-orange-dark active:scale-95
                         transition-all duration-fast
                         shadow-glow-sm hover:shadow-glow-md"
              >
                GET INVOLVED
                <ChevronRight size={18} />
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* Camping, Emergency Prep, and More */}
      <section className="w-full bg-gradient-to-br from-orange-50 via-warm-paper to-red-50 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="max-w-xl lg:order-1">

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                CAMPING, EMERGENCY PREP, AND MORE
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-5">
                Now everyone's getting the bright idea. From backyards in
                California and backpackers in Banff, to emergency kits in
                Florida and dog walkers in Minnesota, LuminAID solar lights
                are illuminating daily life and bringing people together.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
                Perfect for exploring the great outdoors, lighting up pillow
                forts, and being prepared for power outages, families around
                the world are using LuminAID lights in creative ways every day.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-soft
                         text-sm font-bold tracking-wide uppercase
                         hover:bg-brand-orange-dark active:scale-95
                         transition-all duration-fast
                         shadow-glow-sm hover:shadow-glow-md"
              >
                SHOP NOW
                <ChevronRight size={18} />
              </Link>

            </div>

            <div className="overflow-hidden rounded-soft shadow-medium lg:order-2">
              <img
                src={outdoorImage}
                alt="LuminAID lights are perfect for outdoor adventures"
                className="w-full h-auto object-cover"
              />
            </div>

          </div>

        </div>
      </section>


      {/* Shark Tank Success */}
      <section className="w-full bg-white py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="overflow-hidden rounded-soft shadow-medium">
              <img
                src={sharkTankImage}
                alt="LuminAID's co-founders Andrea and Anna with their Shark Tank investor Mark Cuban"
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="max-w-xl">

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                SHARK TANK SUCCESS
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-5">
                In February 2015, LuminAID's founders Anna and Andrea pitched
                the "Sharks" on ABC's Shark Tank. To their surprise, they
                received offers from all 5 Sharks, and walked out of the tank
                with an investment deal from billionaire Mark Cuban, who became
                LuminAID's first investor.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-8">
                LuminAID has since been featured in 2 Shark Tank Updates when
                Anna and Andrea traveled to Malawi and Puerto Rico.
              </p>

              <a
                href="https://www.youtube.com/results?search_query=luminaid+shark+tank"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange text-white px-8 py-3.5 rounded-soft
                         text-sm font-bold tracking-wide uppercase
                         hover:bg-brand-orange-dark active:scale-95
                         transition-all duration-fast
                         shadow-glow-sm hover:shadow-glow-md"
              >
                WATCH ON SHARK TANK
                <ChevronRight size={18} />
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* Crowdfunding Campaigns */}
      <section className="w-full bg-gradient-to-br from-gray-50 to-gray-100 py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div className="max-w-xl lg:order-1">

              <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
                CROWDFUNDING CAMPAIGNS
              </h2>

              <p className="text-base md:text-lg leading-relaxed text-gray-700 mb-5">
                Anna and Andrea first launched LuminAID with a Give Light,
                Get Light campaign on Indiegogo in 2011. The campaign raised
                over $50,000, proving just how bright their idea was.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-gray-700">
                Since then, LuminAID has hosted several more successful
                crowdfunding campaigns for the PackLite Max 2-in-1 Phone
                Charger in 2017 and a new line of solar garden lights in 2018,
                and has raised over $500,000. We wouldn't be where we are
                today without the support of our customers!
              </p>

            </div>

            <div className="overflow-hidden rounded-soft shadow-medium lg:order-2">
              <img
                src={crowdfundingImage}
                alt="Andrea and Anna explaining the initial prototype"
                className="w-full h-auto object-cover"
              />
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export default AboutPage