export const formatNumber = (num, decimals = 0) => {
  if (num === undefined || num === null) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  } catch {
    return num.toString();
  }
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === undefined || num === null) return 'N/A';
  return `${formatNumber(num, decimals)}%`;
};

export const abbreviateNumber = (num) => {
  if (num === undefined || num === null) return 'N/A';
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};