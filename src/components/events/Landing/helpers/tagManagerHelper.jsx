import { useEventContext } from '@context/eventContext';

export function EnableGTMByEVENT() {
  const cEventContext = useEventContext();
  let createElement = null;
  const dataLayer = `dataLayerTagManager${cEventContext.value._id}`;
  const htmlElementId = 'gtmScrip';
  const tagManagerId = cEventContext.value.googletagmanagerid;

  if (!tagManagerId) return null;

  if (!window[dataLayer]) {
    window[dataLayer] = window[dataLayer] || [];
    window[dataLayer].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = document.getElementsByClassName(htmlElementId)[0];
    createElement = document.createElement('script');
    createElement.async = true;
    createElement.src = '//www.googletagmanager.com/gtm.js?id=' + tagManagerId + '&l=' + dataLayer;
    if (f) {
      f.parentNode.insertBefore(createElement, f);
    }
  }
  return null;
}
