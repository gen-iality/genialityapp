import { useEffect } from 'react';

const useInjectScript = (scriptText, id, isBody) => {
  useEffect(() => {
    const eventId = '6334782dc19fe2710a0b8753';
    if (eventId !== id) return;
    const script = document.createElement('script');
    script.innerHTML = scriptText;
    if (isBody === true) {
      document.body.appendChild(script);
    } else {
      document.head.appendChild(script);
    }
    return () => {
      document.body.removeChild(script);
      document.head.removeChild(script);
    };
  }, [scriptText, id]);
};

export default useInjectScript;
