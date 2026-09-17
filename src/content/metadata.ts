import type { Metadata } from "next";

import {
  getAlternateLocale,
  getRouteHref,
  pageContent,
  type Locale,
  type RouteId,
} from "./routes";

export function buildPageMetadata(
  locale: Locale,
  routeId: RouteId,
): Metadata {
  const content = pageContent[locale][routeId];
  const alternateLocale = getAlternateLocale(locale);

  return {
    title: content.title,
    description: content.intro,
    alternates: {
      canonical: getRouteHref(locale, routeId),
      languages: {
        en: getRouteHref("en", routeId),
        "zh-HK": getRouteHref("zh-hk", routeId),
        "x-default": getRouteHref("en", routeId),
      },
    },
    robots: {
      index: false,
      follow: false,
    },
    other: {
      "demo-content": "synthetic",
      "alternate-locale": alternateLocale,
    },
  };
}
