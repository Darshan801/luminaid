import { useState } from 'react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

/**
 * Test Page for Design System Components
 * This page shows all component variants and states
 * Use this to verify components are working correctly
 */
const TestComponents = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTestSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation test
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email');
      return;
    }
    
    setEmailError('');
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert('Form submitted! Check console.');
      console.log({ email, password });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-light p-8">
      <div className="container max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8">
          🎨 Design System Test Page
        </h1>

        {/* Buttons Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Buttons</h2>
          
          {/* Button Variants */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-3">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="danger">Danger Button</Button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-3">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          {/* Button States */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-black mb-3">States</h3>
            <div className="flex flex-wrap gap-4">
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width Button</Button>
            </div>
          </div>

          {/* Interactive Button */}
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">Interactive</h3>
            <Button 
              onClick={() => alert('Button clicked!')}
              variant="primary"
            >
              Click Me!
            </Button>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Inputs</h2>
          
          <div className="max-w-md space-y-6">
            {/* Basic Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email"
              required
            />

            {/* Input with Helper Text */}
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Choose a username"
              helperText="Your username must be unique"
            />

            {/* Input with Error */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter password"
              error="Password must be at least 8 characters"
              required
            />

            {/* Disabled Input */}
            <Input
              label="Disabled Input"
              type="text"
              name="disabled"
              placeholder="This is disabled"
              disabled
              value="Cannot edit this"
            />
          </div>
        </section>

        {/* Complete Form Example */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Complete Form Example</h2>
          
          <form onSubmit={handleTestSubmit} className="max-w-md space-y-6">
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              error={emailError}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              helperText="Must be at least 8 characters"
              required
            />

            <div className="flex gap-4">
              <Button 
                type="submit" 
                variant="primary"
                loading={loading}
              >
                {loading ? 'Submitting...' : 'Submit Form'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setEmailError('');
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </section>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            ✅ Testing Instructions
          </h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Try clicking all the buttons</li>
            <li>• Test form validation (submit without @)</li>
            <li>• Check keyboard navigation (Tab key)</li>
            <li>• Test loading state (submit form)</li>
            <li>• Verify responsive design (resize window)</li>
            <li>• Check hover and focus states</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestComponents;