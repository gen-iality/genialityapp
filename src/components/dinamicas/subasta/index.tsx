import React from 'react';
import Header from '../../../antdComponents/Header';
import AuctionProvider from './context/AuctionContext';
import Initial from './views/Initial';
import './styles/index.css'
export default function auctionModule() {
  return (
    <AuctionProvider>
      <Header 
      title={'Subasta'} 
      description={''} 
      back 
      form 
      />
      <Initial />
    </AuctionProvider>
  );
}
