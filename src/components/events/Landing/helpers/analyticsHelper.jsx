import { useEventContext } from '@context/eventContext';

export function EnableAnalyticsByEVENT() {
  const cEventContext = useEventContext();
  let createElement = null;
  const dataLayer = `dataLayerAnalytics${cEventContext.value._id}`;
  const htmlElementId = 'analyticsScrip';
  const analyticsId = cEventContext.value.googleanlyticsid;

  if (!analyticsId) return null;

  if (!window[dataLayer]) {
    window[dataLayer] = window[dataLayer] || [];
    window[dataLayer].push({ js: new Date().getTime() });
    const f = document.getElementsByClassName(htmlElementId)[0];
    createElement = document.createElement('script');
    createElement.async = true;
    createElement.src = '//www.googletagmanager.com/gtag/js?id=' + analyticsId + '&l=' + dataLayer;
    if (f) {
      f.parentNode.insertBefore(createElement, f);
    }
  }
  return null;
}
