const StepBasics = ({ formData, updateData }) => {
  return (
    <div className="animate-fade-slide">
      <h2 className="text-2xl font-bold text-white mb-2 font-display">Welcome! Let&apos;s get your profile set up.</h2>
      <p className="text-text-muted mb-8 font-sans">A great bio helps you stand out. Tell us a bit about yourself.</p>
      
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-text-primary tracking-wide">YOUR BIO / TAGLINE</label>
        <textarea
          className="search-input-glass w-full resize-none min-h-[120px]"
          placeholder="I'm a creative professional specializing in..."
          value={formData.bio}
          onChange={(e) => updateData({ bio: e.target.value })}
        />
        <p className="text-[11px] text-text-faint mt-1">Make it punchy. You can always change this later.</p>
      </div>
    </div>
  );
};

export default StepBasics;
