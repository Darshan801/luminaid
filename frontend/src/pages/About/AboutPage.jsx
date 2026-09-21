// import ComingSoon from '../../components/common/ComingSoon';

// const AboutPage = () => {
//   return (
//     <ComingSoon 
//       title="About LuminAID"
//       description="Learn about our mission to provide sustainable lighting solutions worldwide."
//     />
//   );
// };

// export default AboutPage;


const AboutPage = () => {
  return (
    <div className="w-full bg-white">

      {/* Page Title */}
      <section className="w-full py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          About LuminAID
        </h1>
      </section>


      {/* Our Mission */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* 
          <img
            src={foundersImage}
            alt="As Seen on Shark Tank: LuminAID's Founders Anna Stork and Andrea Sreshta with a Power Lantern Prototype"
            className="w-full h-auto object-cover"
          />
          */}

          <div className="max-w-[900px] mx-auto py-14 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Mission: LuminAID seeks to make safe light and energy accessible for all.
            </h2>

            <p className="text-base md:text-lg leading-8 text-gray-700 mb-5">
              We conceived of the LuminAID light when we were students at
              architecture school in New York City. A devastating earthquake
              had just struck Haiti, and we asked ourselves what we could
              design to help survivors of such an event. When we think of our
              most basic human needs, we often think of food, water, and
              shelter. But the stories we were hearing of the dangerous
              conditions at night in the tent cities inspired us to turn our
              attention to another critical need: light.
            </p>

            <p className="text-base md:text-lg leading-8 text-gray-700">
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
      <section className="w-full bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-14 text-center">

          {/* 
          <img
            src={foundersGivingImage}
            alt="Anna Stork and Andrea Sreshta"
            className="w-full max-w-[900px] mx-auto h-auto object-cover mb-8"
          />
          */}

          <h3 className="text-2xl md:text-3xl font-bold">
            Anna Stork and Andrea Sreshta
          </h3>

          <p className="mt-2 text-base text-gray-600">
            Inventors & Co-Founders of LuminAID
          </p>

        </div>
      </section>


      {/* Give Light, Get Light */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div>

              {/* 
              <img
                src={giveLightImage}
                alt="Children who received LuminAID lights through the Give Light, Get Light program"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                GIVE LIGHT, GET LIGHT
              </h2>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-6">
                We started LuminAID with a Give Light, Get Light campaign to
                send lights to Pencils of Promise, and have made it a core
                program of our company ever since.
              </p>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-8">
                By sponsoring a light through our Give Light, Get Light
                program, supporters earmark a solar lantern or phone charger
                for the cause of their choice. We then send the lights to our
                humanitarian partners who distribute them to families in
                need.
              </p>

              <a
                href="/give-light"
                className="inline-flex items-center justify-center bg-black text-white px-7 py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
              >
                GET INVOLVED
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* Camping, Emergency Prep, and More */}
      <section className="w-full bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                CAMPING, EMERGENCY PREP, AND MORE
              </h2>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-5">
                Now everyone's getting the bright idea. From backyards in
                California and backpackers in Banff, to emergency kits in
                Florida and dog walkers in Minnesota, LuminAID solar lights
                are illuminating daily life and bringing people together.
              </p>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-8">
                Perfect for exploring the great outdoors, lighting up pillow
                forts, and being prepared for power outages, families around
                the world are using LuminAID lights in creative ways every day.
              </p>

              <a
                href="/products"
                className="inline-flex items-center justify-center bg-black text-white px-7 py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
              >
                SHOP NOW
              </a>

            </div>

            <div>

              {/* 
              <img
                src={outdoorImage}
                alt="LuminAID lights are perfect for outdoor adventures"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

          </div>

        </div>
      </section>


      {/* Shark Tank Success */}
      <section className="w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div>

              {/* 
              <img
                src={sharkTankImage}
                alt="LuminAID's co-founders Andrea and Anna with their Shark Tank investor Mark Cuban"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                SHARK TANK SUCCESS
              </h2>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-5">
                In February 2015, LuminAID's founders Anna and Andrea pitched
                the "Sharks" on ABC's Shark Tank. To their surprise, they
                received offers from all 5 Sharks, and walked out of the tank
                with an investment deal from billionaire Mark Cuban, who became
                LuminAID's first investor.
              </p>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-8">
                LuminAID has since been featured in 2 Shark Tank Updates when
                Anna and Andrea traveled to Malawi and Puerto Rico.
              </p>

              <a
                href="#"
                className="inline-flex items-center justify-center bg-black text-white px-7 py-3 text-sm font-semibold hover:bg-primary-red transition-colors"
              >
                LEARN MORE
              </a>

            </div>

          </div>

        </div>
      </section>


      {/* Crowdfunding Campaigns */}
      <section className="w-full bg-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-16">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            <div className="max-w-[550px]">

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                CROWDFUNDING CAMPAIGNS
              </h2>

              <p className="text-base md:text-lg leading-8 text-gray-700 mb-5">
                Anna and Andrea first launched LuminAID with a Give Light,
                Get Light campaign on Indiegogo in 2011. The campaign raised
                over $50,000, proving just how bright their idea was.
              </p>

              <p className="text-base md:text-lg leading-8 text-gray-700">
                Since then, LuminAID has hosted several more successful
                crowdfunding campaigns for the PackLite Max 2-in-1 Phone
                Charger in 2017 and a new line of solar garden lights in 2018,
                and has raised over $500,000. We wouldn't be where we are
                today without the support of our customers!
              </p>

            </div>

            <div>

              {/* 
              <img
                src={crowdfundingImage}
                alt="Andrea and Anna explaining the initial prototype"
                className="w-full h-auto object-cover"
              />
              */}

            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

export default AboutPage