import React, { useState } from 'react';
import { User, Rocket, Bell, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome aboard!",
      description: "Let's get your profile set up so you can start collaborating with your team.",
      icon: <User className="w-8 h-8 text-blue-500" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Tell us a bit about yourself..." />
          </div>
        </div>
      )
    },
    {
      title: "Stay in the loop",
      description: "How would you like to receive updates about your projects?",
      icon: <Bell className="w-8 h-8 text-purple-500" />,
      content: (
        <div className="space-y-3">
          {['Email Notifications', 'Push Notifications', 'Weekly Digest'].map((option) => (
            <label key={option} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
              <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
              <span className="ml-3 text-sm font-medium text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )
    },
    {
      title: "Ready to launch?",
      description: "You're all set! Review your settings and hit the button below to jump into your dashboard.",
      icon: <Rocket className="w-8 h-8 text-orange-500" />,
      content: (
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <p className="text-sm text-orange-800">
            <strong>Pro Tip:</strong> You can always change these settings later in your Account Preferences.
          </p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Onboarding Complete!");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 flex">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-full transition-all duration-500 ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}
              style={{ width: `${100 / steps.length}%` }}
            />
          ))}
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 bg-gray-50 rounded-full mb-4">
              {steps[currentStep].icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{steps[currentStep].title}</h2>
            <p className="text-gray-500 mt-2">{steps[currentStep].description}</p>
          </div>

          {/* Body Content */}
          <div className="min-h-[200px] mb-8">
            {steps[currentStep].content}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              className={`flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition ${currentStep === 0 ? 'invisible' : 'visible'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </button>
            
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center hover:bg-blue-700 transition shadow-md hover:shadow-lg active:scale-95"
            >
              {currentStep === steps.length - 1 ? (
                <>Get Started <CheckCircle className="ml-2 w-5 h-5" /></>
              ) : (
                <>Continue <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

        {/* Step Indicator dots */}
        <div className="pb-6 flex justify-center space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`h-1.5 rounded-full transition-all ${index === currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;