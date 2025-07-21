import React from 'react'

export const Select = React.forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
})
