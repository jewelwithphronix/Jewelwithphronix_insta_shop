// Grey placeholder cards while products load (hidden from screen readers)
export default function SkeletonCards({ count = 4 }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className="card card--skeleton" aria-hidden="true">
      <div className="card__image" />
      <div className="skel skel--line" />
      <div className="skel skel--short" />
    </div>
  ));
}
