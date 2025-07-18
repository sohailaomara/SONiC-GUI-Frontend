export function Checkbox(props) {
  return <input type="checkbox" className="mr-2" {...props} />;
}
export function CheckboxField({ children }) {
  return <div className="flex items-center space-x-2">{children}</div>;
}