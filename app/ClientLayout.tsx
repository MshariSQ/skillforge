"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/lang-context";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    if (lang === "ar") {
      html.classList.add("font-arabic");
    } else {
      html.classList.remove("font-arabic");
    }
  }, [lang]);

  return <>{children}</>;
}
