"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/home");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-body-1-regular text-label-assistive">로딩중...</p>
    </div>
  );
}
