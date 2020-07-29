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

  return new Promise(async (resolve, reject) => {
    try {
      await firestore
        .collection('event_companies')
        .doc(eventId)
        .set({ stand_types: defaultStandTypes }, { merge: true });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventCompanies = (eventId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await firestore
        .collection('event_companies')
        .doc(eventId)
        .collection('companies')
        .get();
      const data = map(dataMapper, result.docs);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

export const getEventCompaniesStandTypes = (eventId) => {
  return new Promise(async (resolve, reject) => {
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
  });
};

export const getEventCompany = (eventId, companyId) => {
  return new Promise(async (resolve, reject) => {
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
  });
};

export const createEventCompany = (eventId, data) => {
  const payload = pick(companyFormKeys, data);

  return new Promise(async (resolve, reject) => {
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
  });
};

export const updateEventCompany = (eventId, companyId, data) => {
  console.log('debug', data, companyFormKeys);
  const payload = pick(companyFormKeys, data);

  return new Promise(async (resolve, reject) => {
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
  });
};
