export const speakerWithoutImage =
  'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FspeakerWithoutImage.png?alt=media&token=9b2dcec8-1f0e-4575-a842-310651cd8077';

export const scriptGoogleTagManagerAudi = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-N52CQ22');`;
export const noScriptGoogleTagManagerAudi = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N52CQ22"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>`;

export const scriptTeadesAudi = `
window.teads_e = window.teads_e || [];
window.teads_buyer_pixel_id = 7127;
`;

export const scriptTeadeBodyAudi = `
  window.teads_e.push({
    conversionType: "Lead"
  });
`;
