import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { demoEvents, type DemoEvent } from "@fixtures/demo/events";

import { DemoEventList } from "./demo-event-list";

describe("demo event prices", () => {
  it.each(["en", "zh-hk"] as const)(
    "preserves fractional HKD prices in the %s home-page list",
    (locale) => {
      const paidEvent: DemoEvent = {
        ...demoEvents[0],
        price: { kind: "paid", amount: 49.5, currency: "HKD" },
      };
      const html = renderToStaticMarkup(
        <DemoEventList events={[paidEvent]} locale={locale} />,
      );

      expect(html).toContain("<dd>HK$49.50</dd>");
    },
  );
});
