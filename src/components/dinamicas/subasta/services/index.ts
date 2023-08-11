import { DispatchMessageService } from "@/context/MessageService";
import { ApiInterface, Auction, AuctionConfig, IBids, Products } from "../interfaces/auction.interface";
import { AuctionApi, AuctionProductApi } from '@/helpers/request';
import { firestore } from "@/helpers/firebase";
import { saveAuctioFirebase } from "./Execute.service";
const api : ApiInterface = AuctionApi
const apiProduct : Omit<ApiInterface,  'resetProducts'> = AuctionProductApi
export const resetProducts =  async  (eventId : string) => {
    try {
        const response = await api.resetProducts<any>(eventId);
        await deleteOffers(eventId)
        return response;
      } catch (error) {
        DispatchMessageService({ type: 'error', msj: 'No se logro reiniciar los datos', action: 'show' });
        return null;
      }
}
export const createAuction =  async  (eventId : string, params : AuctionConfig) => {
    try {
        const response = await api.createOne<Auction>(eventId,params);
        return response;
      } catch (error) {
        DispatchMessageService({ type: 'error', msj: 'Error al crear la subasta', action: 'show' });
        return null;
      }
}


export const updateAuction =  async  (eventId : string, auctionId: string ,params : AuctionConfig) => {
  try {
      const response = await api.editOne<Auction>(eventId,auctionId,params);
      return response;
    } catch (error) {
      DispatchMessageService({ type: 'error', msj: 'Error al actualizar la subasta', action: 'show' });
      return null;
    }
}

export const getAuction =  async  (eventId : string) => {
    try {

        const response = await api.getOne<Auction>(eventId);
        return response;
      } catch (error) {
        return null;
      }
}
export const deleteAuction =  async  (eventId : string, auctionId: string) => {
    try {

        const response = await api.deleteOne(eventId,auctionId);
        return true;
      } catch (error) {
        DispatchMessageService({ type: 'error', msj: 'Error al eliminar la subasta', action: 'show' });
        return false;
      }
}


export const CreateProduct =  async  (eventId : string, params : Omit<Products, '_id' | 'end_price'> ) => {
  try {
      const response = await apiProduct.createOne<Products>(eventId,params);
      return response;
    } catch (error) {
      console.log(error);
      
      DispatchMessageService({ type: 'error', msj: 'Error al crear el producto', action: 'show' });
      return null;
    }
}
export const deleteProduct =  async  (eventId : string, id :string ) => {
  try {
      const response = await apiProduct.deleteOne(eventId,id);
      return true;
    } catch (error) {
      console.log(error);
      
      DispatchMessageService({ type: 'error', msj: 'Error al elminiar el producto', action: 'show' });
      return false;
    }
}

export const updateProduct =  async  (eventId : string, params : Products ) => {
  try {
    
      const response = await apiProduct.editOne<Products>(eventId,params._id,params);
      return response;
    } catch (error) {
      console.log(error);
      
      DispatchMessageService({ type: 'error', msj: 'Error al actualizar el producto', action: 'show' });
      return null;
    }
}

export const getProducts =  async  (eventId : string) => {
  try {
      const response = await apiProduct.getOne<{data :Products[]}>(eventId)
      return response;
    } catch (error) {
      console.log(error);
      
      DispatchMessageService({ type: 'error', msj: 'Error al solicitar los producto', action: 'show' });
      return null;
    }
}

export const saveOffer =  async  (eventId: string, offer: IBids, auction: Auction ) => {
  try {
    const response = await firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .collection('Bids')
    .add(offer)
      
      if(response && auction.currentProduct) {
        await saveAuctioFirebase(eventId, { ...auction, currentProduct:{ ...auction.currentProduct, price: offer.offered }});
      }
    } catch (error) {
      DispatchMessageService({ type: 'error', msj: 'Error al enviar oferta', action: 'show' });
      return false;
    }
}
 export const deleteOffersByProduct =  async  (eventId: string,productId : string) => {
  try {
    const querySnapshot = await firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .collection('Bids')
    .where('productId', '==', productId)
    .get()

    const data = querySnapshot.docs.forEach((item) => {
      item.ref.delete().then(() => {
        
      })
      .catch((error) => {
        console.log('fallo al eliminar');
      });
    })
    return data
    } catch (error) {
      console.log(error);

      DispatchMessageService({ type: 'error', msj: 'Error al enviar oferta', action: 'show' });
      return [];
    }
 }
 export const deleteOffers =  async  (eventId: string) => {
  try {
    const querySnapshot = await firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .collection('Bids')
    .get()

    const data = querySnapshot.docs.forEach((item) => {
      item.ref.delete().then(() => {
        
      })
      .catch((error) => {
        console.log('fallo al eliminar');
      });
    })
    return data
    } catch (error) {
      console.log(error);

      DispatchMessageService({ type: 'error', msj: 'Error al enviar oferta', action: 'show' });
      return [];
    }
 }
 export const getOffers =  async  (eventId: string) => {
  try {
    const querySnapshot = await firestore
    .collection(`auctionByEventId`)
    .doc(eventId)
    .collection('Bids')
    .get()

    const data = querySnapshot.docs.map((product) => ({ id  : product.id,  ...product.data() }))
    return data
    } catch (error) {
      console.log(error);

      DispatchMessageService({ type: 'error', msj: 'Error al enviar oferta', action: 'show' });
      return [];
    }
 }

