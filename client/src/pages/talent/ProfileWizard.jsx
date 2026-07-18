import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import StepBasics from '../../components/wizard/StepBasics';
import StepSkills from '../../components/wizard/StepSkills';
import StepInterests from '../../components/wizard/StepInterests';

const STEPS = [
  { id: 1, component: StepBasics },
  { id: 2, component: StepSkills },
  { id: 3, component: StepInterests }
];

const ProfileWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    bio: '',
    skills: [],
    interests: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/users/profile');
        setFormData({
          bio: data.bio || '',
          skills: data.skills || [],
          interests: data.interests || []
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const updateData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const isStepValid = () => {
    if (currentStep === 1) return formData.bio.trim().length > 0;
    if (currentStep === 2) return formData.skills.length > 0;
    if (currentStep === 3) return formData.interests.length > 0;
    return false;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      await axios.put('/users/profile', formData);
      navigate('/talent/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentComponent = STEPS[currentStep - 1].component;
  const progressPercent = ((currentStep) / STEPS.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center font-sans">
        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col font-sans">
      {/* Navbar Minimal */}
      <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-bg-surface/50 backdrop-blur-md sticky top-0 z-50">
        <img src="/modelsuite-talents.png" alt="ModelSuite" className="h-6 opacity-80" />
        <button 
          onClick={() => navigate('/talent/dashboard')}
          className="text-[13px] font-semibold text-text-muted hover:text-white transition-colors"
        >
          Cancel
        </button>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/5">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-[13px] font-medium flex items-start gap-2 animate-fade-in">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <div className="bg-bg-surface border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <CurrentComponent formData={formData} updateData={updateData} />

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/5">
              <button
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className={`text-[14px] font-semibold transition-colors ${currentStep === 1 ? 'text-transparent cursor-default' : 'text-text-muted hover:text-white'}`}
              >
                ← Back
              </button>

              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="btn-gradient px-8 py-2.5 rounded-lg text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="btn-gradient px-8 py-2.5 rounded-lg text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfileWizard;
