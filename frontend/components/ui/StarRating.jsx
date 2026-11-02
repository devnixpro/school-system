export default function StarRating({
  count = 5,
  className = 'text-amber-500 text-sm',
}) {
  return (
    <div className={`flex ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <i key={i} className="fa-solid fa-star" />
      ))}
    </div>
  );
}