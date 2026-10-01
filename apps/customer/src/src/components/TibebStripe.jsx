import React from 'react';

export default function TibebStripe({ className = "h-1 w-full" }) {
  return (
    <div 
      className={`tibeb-accent-strip ${className}`}
      aria-hidden="true"
    />
  );
}
