export const TOTAL_PATTERNS = 140704;

export const MILESTONES = [
  { threshold: "100 found", count: 100 },
  { threshold: "1,000 found", count: 1000 },
  { threshold: "10% mapped", count: 14071 },
  { threshold: "halfway", count: 70352 },
  { threshold: "100,000 found", count: 100000 },
  { threshold: "last 1,000", count: 139704 },
  { threshold: "complete", count: TOTAL_PATTERNS },
] as const;
