import PropTypes from "prop-types";

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
