import PropTypes from "prop-types";
export function Input(props) {
  return <input className="p-2 border rounded w-full" {...props} />;
}
Input.propTypes = {
  children: PropTypes.node.isRequired,
};
