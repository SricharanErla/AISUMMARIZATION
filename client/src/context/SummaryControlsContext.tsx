import { createContext, useContext, useMemo, useState } from 'react';
import { summaryOptions, styleOptions, type SummaryStyleOption, type SummaryTypeOption } from './summaryControlsOptions';

interface SummaryControlsValue {
  summaryType: SummaryTypeOption;
  summaryLength: SummaryStyleOption;
  setSummaryType: (value: SummaryTypeOption) => void;
  setSummaryLength: (value: SummaryStyleOption) => void;
}

const SummaryControlsContext = createContext<SummaryControlsValue | null>(null);

export const SummaryControlsProvider = ({ children }: { children: React.ReactNode }) => {
  const [summaryType, setSummaryType] = useState<SummaryTypeOption>('medium');
  const [summaryLength, setSummaryLength] = useState<SummaryStyleOption>('paragraph');

  const value = useMemo(
    () => ({ summaryType, summaryLength, setSummaryType, setSummaryLength }),
    [summaryType, summaryLength]
  );

  return <SummaryControlsContext.Provider value={value}>{children}</SummaryControlsContext.Provider>;
};

export const useSummaryControls = () => {
  const context = useContext(SummaryControlsContext);
  if (!context) throw new Error('useSummaryControls must be used within SummaryControlsProvider');
  return context;
};