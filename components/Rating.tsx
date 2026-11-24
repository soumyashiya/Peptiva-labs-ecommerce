import { StarIcon } from "./icons";

/**
 * Star rating row. The reference pairs solid black stars with a grey review
 * count at the same baseline — no pill, no background, no accent colour.
 */
export default function Rating({
  value,
  count,
  size = 16,
  className = "",
  countClassName = "text-small text-grey-600",
  label,
}: {
  value: number;
  count?: number | string;
  size?: number;
  className?: string;
  countClassName?: string;
  label?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span
        className="flex items-center gap-[2px] text-black"
        role="img"
        aria-label={`Rated ${value} out of 5`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} size={size} fill={value - i} />
        ))}
      </span>
      {count !== undefined && (
        <span className={countClassName}>
          {count} {label ?? "reviews"}
        </span>
      )}
    </div>
  );
}
