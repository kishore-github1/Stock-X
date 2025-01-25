import React from 'react';

const DialogBox = ({ isOpen, onClose, children, dialogRef }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div ref={dialogRef} className="bg-white p-6 rounded-lg shadow-lg z-10">
        {children}
        <button className="mt-4 bg-red-500 text-white p-2 rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DialogBox;