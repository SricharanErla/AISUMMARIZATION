import { useEffect, useState } from 'react';

export const TypingText = ({ text, speed = 18 }: { text: string; speed?: number }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue('');
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setValue(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return <span>{value}</span>;
};
