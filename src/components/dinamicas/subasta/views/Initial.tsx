import React, { useContext } from 'react';
import CreateAuction from '../components/cms/CreateAuction';
import AuctionView from './Auction';
import { AuctionContext } from '../context/AuctionContext';
import Loading from '@/components/profile/loading';
import { AcutionProps } from '../interfaces/auction.interface';

export default function Initial({event} : AcutionProps) {
  const { auction, loading } = useContext(AuctionContext);
  return (
    <>
      {loading ? (
        <Loading />
      ) : !auction ? (
        <CreateAuction key={'primary-config'} active={false} event={event}/>
      ) : (
        <AuctionView auction={auction} event={event}/>
      )}
    </>
  );
}
