import { Link } from 'react-router-dom';
import { Eye, Ear, Hand, Brain, Heart } from 'lucide-react';

const AccessibilityPage = () => {
  return (
    <div className="accessibility-page w-full bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-8 bg-white border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-black">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-black">Accessibility</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="page-title py-16 px-8 text-center">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-black tracking-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            LuminAID is committed to ensuring digital accessibility for people of all abilities.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="content py-12 px-8">
        <div className="max-w-[900px] mx-auto">
          
          {/* Our Commitment */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Heart size={32} className="text-primary-red" />
              <h2 className="text-3xl font-bold text-black">Our Commitment</h2>
            </div>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              LuminAID is committed to making our website accessible to all users, including those with disabilities. 
              We strive to meet or exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              We believe that everyone should have equal access to information about our solar-powered lights and the 
              communities we serve. Accessibility is an ongoing effort, and we continuously work to improve the user 
              experience for everyone.
            </p>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-8">Accessibility Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Eye size={28} className="text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Visual Accessibility</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• High contrast color schemes</li>
                    <li>• Clear, readable font sizes</li>
                    <li>• Alt text for all images</li>
                    <li>• Screen reader compatibility</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Hand size={28} className="text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Keyboard Navigation</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Full keyboard navigation support</li>
                    <li>• Clear focus indicators</li>
                    <li>• Logical tab order</li>
                    <li>• Skip navigation links</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Brain size={28} className="text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Cognitive Accessibility</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Clear, simple language</li>
                    <li>• Consistent navigation</li>
                    <li>• Descriptive headings</li>
                    <li>• Error prevention and recovery</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Ear size={28} className="text-primary-red flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-black mb-2">Audio & Video</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Captions for video content</li>
                    <li>• Transcripts available</li>
                    <li>• No auto-playing audio</li>
                    <li>• Volume controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Standards */}
          <div className="bg-gray-50 p-8 rounded-sm mb-16">
            <h2 className="text-2xl font-bold text-black mb-4">Standards & Guidelines</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Our website follows these accessibility standards:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
              <li>• <strong>Section 508:</strong> US federal accessibility requirements</li>
              <li>• <strong>ADA:</strong> Americans with Disabilities Act compliance</li>
              <li>• <strong>ARIA:</strong> Accessible Rich Internet Applications specifications</li>
            </ul>
          </div>

          {/* Assistive Technologies */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-black mb-6">Compatible Assistive Technologies</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Our website is designed to work with the following assistive technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-2">Screen Readers</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• JAWS</li>
                  <li>• NVDA</li>
                  <li>• VoiceOver (macOS/iOS)</li>
                  <li>• TalkBack (Android)</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-4">
                <h3 className="font-bold text-black mb-2">Browsers</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Chrome (latest)</li>
                  <li>• Firefox (latest)</li>
                  <li>• Safari (latest)</li>
                  <li>• Edge (latest)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-primary-red text-white p-8 rounded-sm">
            <h2 className="text-2xl font-bold mb-4">We Value Your Feedback</h2>
            <p className="text-base leading-relaxed mb-6">
              We are constantly working to improve the accessibility of our website. If you encounter any 
              accessibility barriers or have suggestions for improvement, please let us know.
            </p>
            <div className="space-y-3">
              <p className="font-semibold">Contact us:</p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:accessibility@luminaid.com" className="underline hover:text-gray-200">
                  accessibility@luminaid.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+1-800-LUMINAID" className="underline hover:text-gray-200">
                  1-800-LUMINAID
                </a>
              </p>
            </div>
            <Link
              to="/support/contact"
              className="inline-block mt-6 bg-white text-black font-bold px-6 py-3 hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
          </div>

          {/* Third Party Content */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-black mb-4">Third-Party Content</h2>
            <p className="text-base text-gray-700 leading-relaxed">
              While we strive to ensure accessibility across our entire website, some third-party content 
              and plugins may not be fully under our control. We work with our vendors to ensure their 
              components meet accessibility standards and will address any issues that arise.
            </p>
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
            <p>Last updated: October 9, 2026</p>
            <p className="mt-2">
              This accessibility statement will be reviewed and updated regularly to reflect our ongoing commitment to accessibility.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default AccessibilityPage;
