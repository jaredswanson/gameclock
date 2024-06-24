import React from 'react';

const Alert = ({ children, className = '' }) => {
  return (
    <div className={`bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 ${className}`} role="alert">
      {children}
    </div>
  );
};

export { Alert }
