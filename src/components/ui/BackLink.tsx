import Link from "next/link";

export function BackLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface transition-colors"
    >
      ← Trang chủ
    </Link>
  );
}
