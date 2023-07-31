import { useEffect, useState } from 'react';
import { listenAuction } from '../services/Execute.service';
import { Auction } from '../interfaces/auction.interface';

export const useAuction = (eventId: string) => {
  const [auction, setAuction] = useState<Auction | null>(null);


  useEffect(() => {
    console.log(eventId);
    
    if (eventId) {
      const unsuscribe = listenAuction(eventId,setAuction);
      return () => {
        unsuscribe();
      };
    }
  },[]);

  useEffect(() => {
    console.log(auction);
    
  },[auction]);

  return {
    auction
  };
};
