export const isStagingOrProduccion = (): string => {
  if (window.location.href.includes('staging') || window.location.href.includes('localhost')) {
    return 'staging';
  } else {
    return 'produccion';
  }
};
