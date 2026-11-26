/** ★★★★☆ */
export default function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - rating)}</span>
    </span>
  );
}
