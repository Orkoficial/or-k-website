"use client";

import { useRouter } from "next/navigation";
import PrequalificationForm from "@/components/prequalification-form";

export default function FormularioPage() {
  const router = useRouter();

  return (
    <main>
      <PrequalificationForm onClose={() => router.push("/")} />
    </main>
  );
}
