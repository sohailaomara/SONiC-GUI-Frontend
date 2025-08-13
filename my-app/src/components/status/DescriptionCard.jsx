export default function DescriptionCard({ name, description }) {
  return (
    <div className="bg-white shadow-md shadow-gray-300 border border-gray-100 p-4 rounded w-48 text-gray-800">
      <h3 className="font-bold mb-2 text-gray-700">{name}</h3>
      <p className="text-sm text-gray-600">
        {description && description.trim() !== ""
          ? description
          : "No description"}
      </p>
    </div>
  );
}
