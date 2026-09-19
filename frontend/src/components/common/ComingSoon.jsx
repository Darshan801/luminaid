const ComingSoon = ({ title, description }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-heading font-bold text-black mb-4">
          {title || 'Coming Soon'}
        </h1>
        <p className="text-lg text-gray-medium mb-8">
          {description || 'This page is currently under construction. Check back soon!'}
        </p>
        <a 
          href="/" 
          className="inline-block bg-primary-red text-white font-bold px-8 py-3 rounded-md hover:bg-dark-red transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default ComingSoon;
