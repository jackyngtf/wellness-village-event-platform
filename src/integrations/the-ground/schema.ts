import { z } from "zod";

export const THE_GROUND_MAX_PAGE_SIZE = 50 as const;
export const THE_GROUND_MAX_LOCATION_LENGTH = 120 as const;

const explicitDateTimeSchema = z.iso.datetime({ offset: true });

const httpsUrlSchema = z
  .string()
  .url()
  .refine((value) => new URL(value).protocol === "https:", {
    message: "Expected an HTTPS URL.",
  });

const eventIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

const eventObjectSchema = z
  .object({
    id: eventIdSchema,
    name: z.string().trim().min(1).max(500),
    companyId: z.number().int().positive().max(999_999_999_999),
    startDate: explicitDateTimeSchema,
    endDate: explicitDateTimeSchema,
    location: z.string().trim().max(THE_GROUND_MAX_LOCATION_LENGTH).nullable(),
    capacity: z.number().int().nonnegative().nullable(),
    joinedCount: z.number().int().nonnegative().nullable(),
    shouldPublicRSVP: z.boolean(),
    price: z.union([z.string().max(100), z.number(), z.null()]),
    paymentDetails: z.string().trim().max(100).nullable(),
    imageSrc: httpsUrlSchema.nullable(),
    hasPayment: z.boolean(),
    joinDeadline: explicitDateTimeSchema.nullable(),
    isJoinOpen: z.boolean(),
  })
  .strip();

export const theGroundProviderEventSchema = eventObjectSchema.superRefine(
  (event, context) => {
    if (Date.parse(event.endDate) <= Date.parse(event.startDate)) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Event endDate must be later than startDate.",
      });
    }
  },
);

export const theGroundEventPageSchema = z
  .object({
    data: z.array(theGroundProviderEventSchema).max(THE_GROUND_MAX_PAGE_SIZE),
    meta: z
      .object({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive().max(THE_GROUND_MAX_PAGE_SIZE),
        total: z.number().int().nonnegative(),
        pageCount: z.number().int().nonnegative(),
        hasNextPage: z.boolean(),
        nextPage: z.number().int().positive().nullable(),
      })
      .strip(),
  })
  .strip()
  .superRefine((payload, context) => {
    const { data, meta } = payload;
    if (data.length > meta.pageSize) {
      context.addIssue({
        code: "custom",
        path: ["data"],
        message: "Event count exceeds the declared page size.",
      });
    }

    if (meta.total === 0) {
      if (
        meta.page !== 1 ||
        meta.pageCount !== 0 ||
        data.length !== 0 ||
        meta.hasNextPage ||
        meta.nextPage !== null
      ) {
        context.addIssue({
          code: "custom",
          path: ["meta"],
          message: "Empty pagination metadata is malformed.",
        });
      }
      return;
    }

    const expectedPageCount = Math.ceil(meta.total / meta.pageSize);
    if (meta.pageCount !== expectedPageCount) {
      context.addIssue({
        code: "custom",
        path: ["meta", "pageCount"],
        message: "pageCount does not match total and pageSize.",
      });
    }

    if (meta.pageCount === 0 || meta.page > meta.pageCount) {
      context.addIssue({
        code: "custom",
        path: ["meta", "page"],
        message: "Page cannot exceed pageCount.",
      });
    }

    if (meta.page <= expectedPageCount) {
      const expectedRows =
        meta.page < expectedPageCount
          ? meta.pageSize
          : meta.total - meta.pageSize * (expectedPageCount - 1);
      if (data.length !== expectedRows) {
        context.addIssue({
          code: "custom",
          path: ["data"],
          message: "Event count does not match the declared pagination window.",
        });
      }
    }

    if (meta.hasNextPage) {
      if (meta.page >= meta.pageCount || meta.nextPage !== meta.page + 1) {
        context.addIssue({
          code: "custom",
          path: ["meta", "nextPage"],
          message: "Pagination continuation is malformed.",
        });
      }
    } else if (meta.nextPage !== null || meta.page !== meta.pageCount) {
      context.addIssue({
        code: "custom",
        path: ["meta"],
        message: "Final-page pagination metadata is malformed.",
      });
    }
  });

export type TheGroundProviderEvent = z.infer<
  typeof theGroundProviderEventSchema
>;
export type TheGroundEventPage = z.infer<typeof theGroundEventPageSchema>;
