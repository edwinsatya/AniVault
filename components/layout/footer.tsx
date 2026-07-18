import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/50 pb-28 pt-12 md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-display text-2xl font-bold tracking-[0.22em] text-snow">
            ANI<span className="text-accent-soft">VAULT</span>
          </p>
          <p className="mt-2 max-w-sm text-sm text-mist">
            A cinematic vault for everything you watch, plan, and obsess over.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-mist md:items-end">
          <div className="flex gap-5">
            <Link href="/discover" className="transition-colors hover:text-snow">
              Discover
            </Link>
            <Link href="/seasonal" className="transition-colors hover:text-snow">
              Seasonal
            </Link>
            <Link href="/vault" className="transition-colors hover:text-snow">
              My Vault
            </Link>
          </div>
          <p className="text-xs text-mist/70">
            Data from{" "}
            <a
              href="https://anilist.co"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-line underline-offset-2 transition-colors hover:text-snow"
            >
              AniList
            </a>
            . Not affiliated with AniList.
          </p>
        </div>
      </div>
    </footer>
  );
}
