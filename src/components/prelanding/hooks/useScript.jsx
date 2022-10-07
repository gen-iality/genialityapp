import { useEffect } from 'react';

const useScript = (url, id) => {
  useEffect(() => {
    const eventId = '6334782dc19fe2710a0b8753';
    if (eventId !== id) return;
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url, id]);
};

export default useScript;
