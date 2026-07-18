import type { Metadata } from "next";
import { VaultClient } from "@/components/vault/vault-client";

export const metadata: Metadata = {
  title: "My Vault",
  description:
    "Your personal collection — watching, completed, planned and dropped.",
};

export default function VaultPage() {
  return <VaultClient />;
}
