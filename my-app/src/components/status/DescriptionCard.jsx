export default function DescriptionCard({ name, description }) {
  return (
    <div className="bg-gray-200 border border-gray-100 p-4 rounded w-48">
      <h3 className="font-bold mb-2">{name}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}
