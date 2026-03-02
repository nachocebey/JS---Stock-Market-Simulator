export const formatMoney = (value, currency = 'EUR') => {  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatPercentage = (value) => {
  return `${(value * 100).toFixed(2)}%`;
};

export const calculateChange = (current, previous) => {
  if (previous === 0) return 0;
  return (current - previous) / previous;
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};