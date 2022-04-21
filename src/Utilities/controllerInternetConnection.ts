const controllerInternetConnection = () => {
  let theUserIsOffline: string | boolean = 'initial';

  window.addEventListener('offline', () => {
    theUserIsOffline = true;
    console.log('🚀 debug ~ window.addEventListener ~ offline');
  });

  window.addEventListener('online', () => {
    theUserIsOffline = false;
    console.log('🚀 debug ~ window.addEventListener ~ online');
  });

  return theUserIsOffline;
};

export default controllerInternetConnection;
