import React from 'react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string // e.g., 'text-blue-500'
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'border-blue-500',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-8',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${color} 
        ${className} 
        animate-spin
        rounded-full 
        border-t-transparent 
      `}
      role="status" // Good practice for accessibility
    >
      <span className="sr-only">Loading...</span> {/* Hidden text for screen readers */}
    </div>
  )
}

export default Spinner
