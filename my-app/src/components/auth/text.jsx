import PropTypes from "prop-types";
export function Text({ children }) {
  return <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>;
}

export function Strong({ children }) {
  return (
    <strong className="font-semibold text-gray-900 dark:text-white">
      {children}
    </strong>
  );
}

export function TextLink({ href, children }) {
  return (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  );
}
Text.propTypes = {
  children: PropTypes.node.isRequired,
};
