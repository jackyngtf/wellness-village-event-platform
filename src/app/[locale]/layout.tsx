import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "../globals.css";
import { isLocale, locales } from "@/content/routes";

export const dynamicParams = false;

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#173f32",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    title: {
      default:
        locale === "en"
          ? "Wellness Village · Synthetic Reference"
          : "Wellness Village · 合成參考版本",
      template: "%s · Wellness Village Reference",
    },
    description:
      locale === "en"
        ? "A bilingual, local-only reference app built entirely with synthetic content."
        : "完全採用合成內容製作的雙語純本機參考應用程式。",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale === "en" ? "en" : "zh-HK"}>
      <body>{children}</body>
    </html>
  );
}
