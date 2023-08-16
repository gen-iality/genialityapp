import { UseUserEvent } from '@/context/eventUserContext';
import { ReactNode, createContext, useEffect, useState } from 'react';
import * as service from '../services/index';
import { Auction, AuctionConfig, Products, ModalProduct } from '../interfaces/auction.interface';
import { deleteAuctionFirebase, listenAuction, saveAuctioFirebase } from '../services/Execute.service';

interface AuctionContextType {
  eventId: string;
  auction: Auction | null;
  loading: boolean;
  loadingConfig: boolean;
  saveAuction: (params: AuctionConfig) => Promise<void>;
  deleteAuction: (auctionId?: string) => Promise<void>;
  uptadeAuction: (params: AuctionConfig, auctionId?: string) => Promise<void>;
}

export const AuctionContext = createContext<AuctionContextType>({} as AuctionContextType);

interface Props {
  children: ReactNode;
}

export default function AuctionProvider(props: Props) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const cUser = UseUserEvent();
  const eventId = cUser?.value?.event_id;

  useEffect(() => {
    if (eventId) {
      const unsuscribe = listenAuction(eventId, setAuction);
      setLoading(false);
      return () => {
        unsuscribe();
      };
    }
  }, []);

  const getAuction = async () => {
    const data = await service.getAuction(eventId);
    setAuction(data);
    setLoading(false);
  };

  const saveAuction = async (params: AuctionConfig) => {
    setLoading(true);
    const response = await service.createAuction(eventId, params);
    if (response) await saveAuctioFirebase(eventId, response);
    setLoading(false);
  };

  const deleteAuction = async (auctionId?: string) => {
    if (!auctionId) return;
    setLoading(true);
    const response = await service.deleteAuction(eventId, auctionId);
    if (response) await deleteAuctionFirebase(eventId);

    setLoading(false);
  };
  const uptadeAuction = async (params: AuctionConfig, auctionId?: string) => {
    if (!auctionId) return;
    setLoadingConfig(true);
    const response = await service.updateAuction(eventId, auctionId, params);
    if (response && auction)
      await saveAuctioFirebase(eventId, {
        ...response,
        opened: auction.opened ?? false,
        published: auction.published ?? false,
        currentProduct: auction.currentProduct ?? null,
        playing: auction.playing ?? false,
        styles: auction.styles ?? {},
        amount: params.amount ?? null,
        timerBids: params.timerBids,
      });

    setLoadingConfig(false);
  };

  const values = {
    eventId,
    auction,
    loading,
    loadingConfig,
    saveAuction,
    deleteAuction,
    uptadeAuction,
  };
  return <AuctionContext.Provider value={values}>{props.children}</AuctionContext.Provider>;
}
