import Link from "next/link";

export default function AnimeNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-display text-7xl font-bold text-line">404</p>
      <h1 className="font-display text-2xl font-bold tracking-tight text-snow">
        This one isn&apos;t in the vault
      </h1>
      <p className="max-w-sm text-sm text-mist">
        The title you&apos;re looking for doesn&apos;t exist or can&apos;t be
        shown.
      </p>
      <Link
        href="/discover"
        className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
      >
        Back to Discover
      </Link>
    </div>
  );
}
