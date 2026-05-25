export const LoadingSkeleton = ({ className = '' }: { className?: string }) => {
  return <div className={`animate-shimmer rounded-3xl skeleton bg-[length:400%_100%] ${className}`} />;
};
