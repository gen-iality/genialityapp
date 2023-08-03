import { useEffect, useState } from 'react';
import { listenBids } from '../services/Execute.service';
import { IBids } from '../interfaces/auction.interface';

export const useBids = (eventId: string, productId?: string, playing?: boolean) => {
  const [Bids, setBids] = useState<IBids[]>([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    if (eventId && productId) {
      setloading(true);
      const unsuscribe = listenBids(eventId, productId, setBids,setloading);
      return () => {
        unsuscribe();
      };
    }
  }, [productId]);


  return {
    Bids,
    setBids,
    loading
  };
};
