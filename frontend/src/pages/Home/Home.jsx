import { Star, Accessibility } from 'lucide-react'
import backgroundImage from '../../assets/images/background.webp'

const Home = () => {
  return (
    <div className="w-full">
      
      {/* Hero Section */}
      <section className="relative w-full h-[525px] flex items-center justify-center overflow-hidden">
        
        {/* Background Image */}
        <img 
          src={backgroundImage} 
          alt="LuminAID outdoor adventure" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Content Container */}
        <div className="relative max-w-[1440px] w-full mx-auto px-10 py-12">
          
          {/* Orange Card */}
          <div className="bg-primary-orange max-w-[388px] px-10 py-12 space-y-4 text-center ml-32">
            
            {/* Star Rating */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#E8C441" stroke="#E8C441" />
                ))}
              </div>
              <span className="text-[11px] font-bold text-white tracking-wider">
                10,000+ 5-STAR REVIEWS
              </span>
            </div>
            
            {/* Heading */}
            <h1 className="text-[28px] font-bold text-white leading-tight">
              Gear Up for Adventure
            </h1>
            
            {/* Description */}
            <p className="text-white text-sm leading-6">
              Light up fall nights with <span className="underline underline-offset-2">Power Lanterns</span>, <span className="underline underline-offset-2">String Lights</span>, and <span className="underline underline-offset-2">Outdoor Gear</span>!
            </p>
            
            {/* CTA Button */}
            <div className="pt-2">
              <button className="bg-primary-red hover:bg-red-700 text-white font-bold px-5 py-2.5 text-xs tracking-wider transition-colors">
                SHOP BESTSELLERS
              </button>
            </div>
            
          </div>
          
        </div>

        {/* Accessibility Button */}
        <button
          aria-label="Accessibility options"
          className="fixed bottom-16 right-5 z-40 w-9 h-9 rounded-full bg-[#1e6fd9] text-white border-2 border-white ring-2 ring-[#1e6fd9] flex items-center justify-center"
        >
          <Accessibility size={20} />
        </button>
        
      </section>
      
    </div>
  )
}

export default Home