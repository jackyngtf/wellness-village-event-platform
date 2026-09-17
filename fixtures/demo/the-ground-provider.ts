export const DEMO_REFERENCE_NOW_ISO = "2030-06-01T03:00:00.000Z";

const shared = {
  companyId: 424242,
  location: "Garden Room",
  capacity: 20,
  joinedCount: 4,
  shouldPublicRSVP: true,
  price: "0",
  paymentDetails: null,
  imageSrc: null,
  hasPayment: false,
  joinDeadline: null,
  isJoinOpen: true,
  providerContact: "operations@provider.example.com",
  coaches: [{ name: "Synthetic facilitator" }],
  internalState: "not-for-presentation",
} as const;

export const demoTheGroundProviderEvents = [
  {
    ...shared,
    id: "demo-paper-garden-01",
    name: "Paper Garden Ritual",
    startDate: "2030-06-01T00:00:00.000Z",
    endDate: "2030-06-01T01:00:00.000Z",
    location: "Workshop Table",
    imageSrc:
      "https://media.example.com/the-ground-demo/paper-garden-01.webp",
  },
  {
    ...shared,
    id: "demo-harbour-flow-02",
    name: "Harbour Light Flow + Tidal Listening Reset",
    startDate: "2030-06-01T02:00:00.000Z",
    endDate: "2030-06-01T04:00:00.000Z",
    imageSrc:
      "https://media.example.com/the-ground-demo/harbour-flow-02.webp",
  },
  {
    ...shared,
    id: "demo-lantern-core-03",
    name: "Lantern Core Studio",
    startDate: "2030-06-01T05:00:00.000Z",
    endDate: "2030-06-01T06:00:00.000Z",
    hasPayment: true,
    price: "180",
    paymentDetails: "180 HKD",
  },
  {
    ...shared,
    id: "demo-quiet-tide-04",
    name: "Quiet Tide Session",
    startDate: "2030-06-01T07:00:00.000Z",
    endDate: "2030-06-01T08:00:00.000Z",
    location: "Quiet Hall",
    isJoinOpen: false,
  },
  {
    ...shared,
    id: "demo-common-table-05",
    name: "Common Table Reading Circle",
    startDate: "2030-06-01T15:30:00.000Z",
    endDate: "2030-06-01T16:30:00.000Z",
    location: "Library Terrace",
  },
  {
    ...shared,
    id: "demo-open-listing-06",
    name: "Open Studio Listing",
    startDate: "2030-06-02T10:00:00.000Z",
    endDate: "2030-06-04T01:30:00.000Z",
    location: "North Studio",
    hasPayment: true,
    price: null,
    paymentDetails: "Ask provider",
    shouldPublicRSVP: false,
  },
] as const;
