import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../hooks/useCheckout';

const UploadProofStep = () => {
  const navigate = useNavigate();
  const {
    orderId,
    uploadPaymentScreenshot,
    prevStep,
    loading
  } = useCheckout();

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError('');

      await uploadPaymentScreenshot(selectedFile);

      // Navigate to pending page
      navigate(`/orders/pending/${orderId}`);
    } catch (err) {
      setError(err.message || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate file input change
      const fakeEvent = { target: { files: [file] } };
      handleFileSelect(fakeEvent);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-6">
        Upload Payment Proof
      </h2>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-soft p-4 shadow-soft">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-blue-900 mb-2">
                Please upload a clear screenshot of your payment
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• The screenshot should show the transaction details</p>
                <p>• Make sure the amount and date are clearly visible</p>
                <p>• Accepted formats: JPG, PNG (max 10MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Payment Screenshot *
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-soft p-8 text-center 
                     hover:border-brand-orange hover:bg-orange-50/50
                     transition-all duration-fast cursor-pointer"
            onClick={() => document.getElementById('file-input').click()}
          >
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Payment screenshot preview"
                  className="max-h-64 mx-auto rounded-soft shadow-medium"
                />
                <div className="text-sm text-gray-700">
                  <p className="font-bold">{selectedFile.name}</p>
                  <p className="text-gray-600">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                  className="text-sm text-red-600 hover:text-red-700 font-bold
                           transition-colors duration-fast"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-brand-orange">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-6">
          <button
            onClick={prevStep}
            disabled={uploading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-soft 
                     hover:border-gray-400 hover:bg-gray-50
                     active:scale-98
                     transition-all duration-fast
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Back
          </button>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading || loading}
            className="px-8 py-3 bg-brand-orange text-white font-bold rounded-soft 
                     hover:bg-brand-orange-dark 
                     active:scale-95
                     transition-all duration-fast 
                     shadow-glow-sm hover:shadow-glow-md
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          >
            {uploading || loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              'Submit Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProofStep;
