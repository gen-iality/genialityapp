import { UseEventContext } from '../../../../Context/eventContext';

export function EnableAnalyticsByEVENT() {
   let cEventContext = UseEventContext();
   let createElement = null;
   let dataLayer = `dataLayerAnalytics${cEventContext.value._id}`;
   let htmlElementId = 'analyticsScrip';
   let analyticsId = cEventContext.value.googleanlyticsid;

   if (!analyticsId) return null;

   if (!window[dataLayer]) {
    //   console.log('10. Start TagManager');
      window[dataLayer] = window[dataLayer] || [];
      window[dataLayer].push({ 'js': new Date().getTime()});
      var f = document.getElementsByClassName(htmlElementId)[0];
      createElement = document.createElement('script');
      createElement.async = true;
      createElement.src = '//www.googletagmanager.com/gtag/js?id=' + analyticsId  + '&l=' + dataLayer
      if (f) {
         f.parentNode.insertBefore(createElement, f);
      }
   }
   return null;
}