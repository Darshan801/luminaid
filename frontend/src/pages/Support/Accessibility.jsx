import { Link } from 'react-router-dom';
import { Eye, Ear, Hand, Brain, Heart, Monitor, ChevronRight } from 'lucide-react';

const AccessibilityPage = () => {
  return (
    <div className="accessibility-page w-full bg-white">
      {/* Breadcrumb */}
      <section className="breadcrumb py-4 px-6 md:px-8 bg-white border-b border-gray-100">
        <div className="container max-w-content mx-auto">
          <nav className="text-body-sm text-muted-neutral">
            <Link to="/" className="hover:text-brand-orange transition-colors duration-fast">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/support/guides" className="hover:text-brand-orange transition-colors duration-fast">Support</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal font-medium">Accessibility</span>
          </nav>
        </div>
      </section>

      {/* Page Title */}
      <section className="section-py bg-gradient-to-b from-warm-paper to-white text-center">
        <div className="container max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center">
              <Heart size={32} className="text-brand-orange" />
            </div>
          </div>
          <h1 className="text-heading-lg md:text-heading-xl font-display font-bold text-charcoal mb-4">
            Accessibility Statement
          </h1>
          <p className="text-body-lg text-muted-neutral max-w-2xl mx-auto">
            LuminAID is committed to ensuring digital accessibility for people of all abilities.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-py-lg bg-white">
        <div className="container max-w-4xl mx-auto">
          
          {/* Our Commitment */}
          <div className="mb-16">
            <h2 className="text-heading-md font-display font-bold text-charcoal mb-6">
              Our Commitment
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-body-md text-charcoal leading-relaxed mb-4">
                LuminAID is committed to making our website accessible to all users, including those with disabilities. 
                We strive to meet or exceed the requirements of the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              </p>
              <p className="text-body-md text-charcoal leading-relaxed">
                We believe that everyone should have equal access to information about our solar-powered lights and the 
                communities we serve. Accessibility is an ongoing effort, and we continuously work to improve the user 
                experience for everyone.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-heading-md font-display font-bold text-charcoal mb-10">
              Accessibility Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 bg-warm-paper border border-gray-100 rounded-soft p-6
                            hover:border-brand-orange transition-colors duration-fast">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                              flex items-center justify-center mt-1">
                  <Eye size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-charcoal mb-3">
                    Visual Accessibility
                  </h3>
                  <ul className="space-y-2 text-body-sm text-muted-neutral">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>High contrast color schemes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Clear, readable font sizes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Alt text for all images</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Screen reader compatibility</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 bg-warm-paper border border-gray-100 rounded-soft p-6
                            hover:border-brand-orange transition-colors duration-fast">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                              flex items-center justify-center mt-1">
                  <Hand size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-charcoal mb-3">
                    Keyboard Navigation
                  </h3>
                  <ul className="space-y-2 text-body-sm text-muted-neutral">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Full keyboard navigation support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Clear focus indicators</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Logical tab order</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Skip navigation links</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 bg-warm-paper border border-gray-100 rounded-soft p-6
                            hover:border-brand-orange transition-colors duration-fast">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                              flex items-center justify-center mt-1">
                  <Brain size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-charcoal mb-3">
                    Cognitive Accessibility
                  </h3>
                  <ul className="space-y-2 text-body-sm text-muted-neutral">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Clear, simple language</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Consistent navigation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Descriptive headings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Error prevention and recovery</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 bg-warm-paper border border-gray-100 rounded-soft p-6
                            hover:border-brand-orange transition-colors duration-fast">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex-shrink-0 
                              flex items-center justify-center mt-1">
                  <Ear size={20} className="text-brand-orange" />
                </div>
                <div>
                  <h3 className="text-title-lg font-bold text-charcoal mb-3">
                    Audio & Video
                  </h3>
                  <ul className="space-y-2 text-body-sm text-muted-neutral">
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Captions for video content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Transcripts available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>No auto-playing audio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-brand-orange mt-0.5">•</span>
                      <span>Volume controls</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Standards */}
          <div className="bg-gradient-to-br from-warm-paper to-white border border-gray-100 
                        rounded-soft p-8 md:p-10 mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center">
                <Monitor size={20} className="text-brand-orange" />
              </div>
              <h2 className="text-heading-sm md:text-heading-md font-display font-bold text-charcoal">
                Standards & Guidelines
              </h2>
            </div>
            <p className="text-body-md text-charcoal leading-relaxed mb-4">
              Our website follows these accessibility standards:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">✓</span>
                <span className="text-body-md text-charcoal">
                  <strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">✓</span>
                <span className="text-body-md text-charcoal">
                  <strong>Section 508:</strong> US federal accessibility requirements
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">✓</span>
                <span className="text-body-md text-charcoal">
                  <strong>ADA:</strong> Americans with Disabilities Act compliance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-orange mt-1">✓</span>
                <span className="text-body-md text-charcoal">
                  <strong>ARIA:</strong> Accessible Rich Internet Applications specifications
                </span>
              </li>
            </ul>
          </div>

          {/* Third Party Content */}
          <div className="mb-16">
            <h2 className="text-heading-md font-display font-bold text-charcoal mb-4">
              Third-Party Content
            </h2>
            <p className="text-body-md text-charcoal leading-relaxed">
              While we strive to ensure accessibility across our entire website, some third-party content 
              and plugins may not be fully under our control. We work with our vendors to ensure their 
              components meet accessibility standards and will address any issues that arise.
            </p>
          </div>

        </div>
      </section>

      {/* Feedback CTA */}
      <section className="section-py bg-gradient-to-br from-brand-orange to-brand-red">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-heading-md md:text-heading-lg font-display font-bold text-white mb-4">
            We Value Your Feedback
          </h2>
          <p className="text-body-lg text-white/90 mb-8">
            If you encounter any accessibility barriers or have suggestions for improvement, please let us know.
          </p>
          <Link
            to="/support/contact"
            className="inline-flex items-center justify-center gap-2
                     bg-white text-brand-orange font-bold 
                     px-10 py-4 text-body-md
                     rounded-soft shadow-strong
                     hover:bg-warm-paper hover:shadow-glow-lg
                     active:scale-[0.98]
                     transition-all duration-normal"
          >
            Contact Support
            <ChevronRight size={20} />
          </Link>
          <p className="text-body-sm text-white/80 mt-8">
            Last updated: October 9, 2026
          </p>
        </div>
      </section>

    </div>
  );
};

export default AccessibilityPage;
