import React, { useContext } from 'react';
import CreateAuction from '../components/cms/CreateAuction';
import AuctionView from './Auction';
import { AuctionContext } from '../context/AuctionContext';
import Loading from '@/components/profile/loading';

export default function Initial() {
  const { auction, loading } = useContext(AuctionContext);
  return (
    <>
      {loading ? (
        <Loading />
      ) : !auction ? (
        <CreateAuction key={'primary-config'} active={false} />
      ) : (
        <AuctionView auction={auction} />
      )}
    </>
  );
}
