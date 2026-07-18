const AVAILABLE_INTERESTS = [
  {
    id: 'Full-time',
    title: 'Full-time Roles',
    desc: 'I am looking for permanent positions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    )
  },
  {
    id: 'Freelance',
    title: 'Freelance & Contract',
    desc: 'I want flexible, short-term projects.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    )
  },
  {
    id: 'Mentorship',
    title: 'Mentorship',
    desc: 'I want to mentor others or find a mentor.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  }
];

const StepInterests = ({ formData, updateData }) => {
  const toggleInterest = (interestId) => {
    const isSelected = formData.interests.includes(interestId);
    const newInterests = isSelected
      ? formData.interests.filter(i => i !== interestId)
      : [...formData.interests, interestId];
    updateData({ interests: newInterests });
  };

  return (
    <div className="animate-fade-slide">
      <h2 className="text-2xl font-bold text-white mb-2 font-display">What are your goals here?</h2>
      <p className="text-text-muted mb-8 font-sans">Select what you are looking for on this platform.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {AVAILABLE_INTERESTS.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            className={`wizard-card ${formData.interests.includes(item.id) ? 'wizard-card-active' : ''}`}
            onClick={() => toggleInterest(item.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleInterest(item.id);
              }
            }}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.interests.includes(item.id) ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-white/50'}`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white font-display mb-1">{item.title}</h3>
              <p className="text-[13px] text-text-muted leading-relaxed font-sans">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepInterests;
