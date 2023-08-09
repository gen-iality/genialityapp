import { useEffect, useState } from 'react';
import { listenAuction } from '../services/Execute.service';
import { Auction } from '../interfaces/auction.interface';
import { getOffers } from '../services';

export const useSatistic = (eventId: string) => {
  const [offers, setOffers] = useState<any[]>([]);

const callOffers = async () => {
    if (eventId) {
        const data = await getOffers(eventId);
        console.log(eventId,'data', data);
        
        setOffers(data);
      }
}
  useEffect(() => {
    callOffers();
  },[]);

  return {
    offers
  };
};
