export function Field({ children }) {
  return <div className="flex flex-col gap-1">{children}</div>;
}

export function Label({ children }) {
  return <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</label>;
}