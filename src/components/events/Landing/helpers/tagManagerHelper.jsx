import { useEventContext } from '@context/eventContext';

export function EnableGTMByEVENT() {
  let cEventContext = useEventContext();
  let createElement = null;
  let dataLayer = `dataLayerTagManager${cEventContext.value._id}`;
  let htmlElementId = 'gtmScrip';
  let tagManagerId = cEventContext.value.googletagmanagerid;

  if (!tagManagerId) return null;

  if (!window[dataLayer]) {
    //   console.log('10. Start TagManager');
    window[dataLayer] = window[dataLayer] || [];
    window[dataLayer].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = document.getElementsByClassName(htmlElementId)[0];
    createElement = document.createElement('script');
    createElement.async = true;
    createElement.src = '//www.googletagmanager.com/gtm.js?id=' + tagManagerId + '&l=' + dataLayer;
    if (f) {
      f.parentNode.insertBefore(createElement, f);
    }
  }
  return null;
}
