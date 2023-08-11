import { firestore } from '@/helpers/firebase';
import { Auction } from '../interfaces/auction.interface';

export const saveAuctioFirebase = async (eventId: string, createAuction: Auction) => {
  try {
    await firestore
      .collection(`auctionByEventId`)
      .doc(eventId)
      .set(createAuction);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const deleteAuctionFirebase = async (eventId: string) => {
  try {
    const subcoleccionRef = firestore
      .collection('auctionByEventId')
      .doc(eventId)
      .collection('Bids');

    const subcoleccionDocs = await subcoleccionRef.get();
    subcoleccionDocs.forEach(async (doc) => {
      await subcoleccionRef.doc(doc.id).delete();
    });

    await firestore
      .collection('auctionByEventId')
      .doc(eventId)
      .delete();

    return true;
  } catch (error) {
    return false;
  }
};

export const listenAuction = (eventId: string, setConfig: any) => {
  return firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .onSnapshot((snapshot) => {
      if (snapshot.exists) {
        const data = snapshot.data();
        setConfig(data);
      } else {
        setConfig(null);
      }
    });
};
export const listenBids = (eventId: string, productID: string, setBids: any, setLoading?: any) => {
  return firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .collection('Bids')
    .where('productId', '==', productID)
    .onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBids(data);
      } else {
        setBids([]);
      }
      setLoading(false);
    });
};
