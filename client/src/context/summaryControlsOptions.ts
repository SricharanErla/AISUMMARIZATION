export const summaryOptions = ['short', 'medium', 'detailed'] as const;
export const styleOptions = ['paragraph', 'bullets', 'highlights'] as const;

export type SummaryTypeOption = (typeof summaryOptions)[number];
export type SummaryStyleOption = (typeof styleOptions)[number];