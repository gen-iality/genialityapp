import { useEffect, useState } from 'react';
import { listenBids } from '../services/Execute.service';

export const useAuction = (eventId: string, productId?: string, playing?: boolean) => {
  const [Bids, setBids] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    console.log('productId', productId, playing);
    if (eventId && productId) {
      setloading(true);
      const unsuscribe = listenBids(eventId, productId, setBids,setloading);
      return () => {
        unsuscribe();
      };
    }
  }, [productId]);

  useEffect(() => {
    console.log('Bids', Bids);
  }, [Bids]);

  return {
    Bids,
    setBids,
    loading
  };
};
