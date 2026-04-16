import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

const OnboardingSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white rounded-lg shadow-sm p-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-light mb-2">Onboarding Completed!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for completing your onboarding. Your offer letter and further instructions 
          will be sent to your email shortly.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2"
        >
          <Home size={14} />
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default OnboardingSuccess;