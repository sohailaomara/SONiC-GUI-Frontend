export default function DescriptionCard({ name, description }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow transition-shadow">
      <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{name}</h3>
      <p className="text-gray-600 text-sm truncate">{description || "No description"}</p>
    </div>
  );
}