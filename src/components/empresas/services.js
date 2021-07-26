import { map, path, pick } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';

import { firestore } from '../../helpers/firebase';
import { companyFormKeys } from './crearEditarEmpresa';

function dataMapper(doc) {
  return {
    ...doc.data(),
    id: doc.id
  };
}

export const createEventDefaultStandTypes = (eventId) => {
  const defaultStandTypes = ['Oro', 'Plata', 'Bronce'];

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await firestore
          .collection('event_companies')
          .doc(eventId)
          .set({ stand_types: defaultStandTypes }, { merge: true });
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const createEventDefaultSocialNetworks = (eventId) => {
  const defaultSocialNetworks = ['facebook', 'twitter', 'instagram', 'linkedin'];

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await firestore
          .collection('event_companies')
          .doc(eventId)
          .set({ social_networks: defaultSocialNetworks }, { merge: true });
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const getEventCompanies = (eventId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = await firestore
          .collection('event_companies')
          .doc(eventId)
          .collection('companies')//.orderBy("order")
          .get();
        const data = map(dataMapper, result.docs);

        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const getEventCompaniesStandTypes = (eventId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = await firestore
          .collection('event_companies')
          .doc(eventId)
          .get();       
        const eventCompaniesDoc = result.data();
        const standTypes = path(['stand_types'], eventCompaniesDoc);

        if (isNonEmptyArray(standTypes)) {
          resolve(standTypes);
        } else {
          createEventDefaultStandTypes(eventId);
          reject();
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const getEventCompaniesSocialNetworks = (eventId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = await firestore
          .collection('event_companies')
          .doc(eventId)
          .get();
        const eventCompaniesDoc = result.data();
        const socialNetworks = path(['social_networks'], eventCompaniesDoc);

        if (isNonEmptyArray(socialNetworks)) {
          resolve(socialNetworks);
        } else {
          createEventDefaultSocialNetworks(eventId);
          reject();
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const getEventCompany = (eventId, companyId) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = await firestore
          .collection('event_companies')
          .doc(eventId)
          .collection('companies')
          .doc(companyId)
          .get();
        const company = result.data();

        if (!company) {
          reject();
        } else {
          resolve(company);
        }
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const createEventCompany = (eventId, data) => {
  const payload = pick(companyFormKeys, data);

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const newCompany = await firestore
          .collection('event_companies')
          .doc(eventId)
          .collection('companies')
          .add(payload);
        resolve(newCompany.id);
      } catch (error) {
        reject(error);
      }
    })();
  });
};

export const updateEventCompany = (eventId, companyId, data) => {
  const payload = pick(companyFormKeys, data);

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        await firestore
          .collection('event_companies')
          .doc(eventId)
          .collection('companies')
          .doc(companyId)
          .update(payload);
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });
};
