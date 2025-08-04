import PropTypes from "prop-types";
export function Heading({ children }) {
  return (
    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
      {children}
    </h1>
  );
}
Heading.propTypes = {
  children: PropTypes.node.isRequired,
};
