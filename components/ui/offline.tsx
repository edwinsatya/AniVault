import { CloudOff } from "lucide-react";

export function VaultOffline() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <CloudOff className="size-10 text-mist" />
      <h2 className="font-display text-2xl font-bold tracking-tight text-snow">
        The vault is sealed
      </h2>
      <p className="max-w-sm text-sm text-mist">
        AniList could not be reached. Check your connection and reload — the
        vault will reopen.
      </p>
    </div>
  );
}
