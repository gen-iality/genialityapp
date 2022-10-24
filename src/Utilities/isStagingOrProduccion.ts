export const isStagingOrProduccion = (): string => {
  if (
    window.location.href.includes('staging') ||
    window.location.href.includes('localhost') ||
    window.location.href.includes('dinamicas') ||
    window.location.href.includes('eviusbeta')
  ) {
    return 'staging';
  } else {
    return 'produccion';
  }
};
