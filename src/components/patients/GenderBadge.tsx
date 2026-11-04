import clsx from "clsx";
import type { Gender } from "@/types";

export function GenderBadge({ gender }: { gender: Gender }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        gender === "female" ? "bg-brand-tint text-brand-dark" : "bg-line text-ink"
      )}
    >
      {gender}
    </span>
  );
}