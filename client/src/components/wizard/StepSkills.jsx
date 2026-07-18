const AVAILABLE_SKILLS = [
  'React', 'Node.js', 'Figma', 'UI/UX Design', 'Copywriting',
  'Marketing', 'SEO', 'Video Editing', '3D Modeling', 'Photography',
  'Project Management', 'Data Analysis', 'Python', 'Illustration'
];

const StepSkills = ({ formData, updateData }) => {
  const toggleSkill = (skill) => {
    const isSelected = formData.skills.includes(skill);
    const newSkills = isSelected
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    updateData({ skills: newSkills });
  };

  return (
    <div className="animate-fade-slide">
      <h2 className="text-2xl font-bold text-white mb-2 font-display">What are your superpowers?</h2>
      <p className="text-text-muted mb-8 font-sans">Select the skills that best represent your expertise.</p>
      
      <div className="flex flex-wrap gap-3">
        {AVAILABLE_SKILLS.map((skill) => (
          <button
            key={skill}
            type="button"
            className={`wizard-pill ${formData.skills.includes(skill) ? 'wizard-pill-active' : ''}`}
            onClick={() => toggleSkill(skill)}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSkills;
