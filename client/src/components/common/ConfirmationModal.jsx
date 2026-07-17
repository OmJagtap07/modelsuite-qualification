import React from 'react';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // Determine styles based on variant
  const confirmButtonClass = confirmVariant === 'danger'
    ? 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20'
    : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20';

  return (
    <div 
      className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[300] p-6"
      // Explicitly NOT adding onClick={onCancel} here per user requirement (destructive actions require explicit intent)
    >
      <div 
        className="bg-bg-card border border-border rounded-xl w-full max-w-sm shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-[17px] font-semibold text-text-primary">{title}</h2>
          <button 
            onClick={onCancel}
            className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-[15px] text-text-muted leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6 pt-1">
          <button 
            onClick={onCancel}
            className="flex-1 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all font-sans ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
