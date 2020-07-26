import { map, path } from 'ramda';
import { isNonEmptyArray } from 'ramda-adjunct';

import { firestore } from '../../helpers/firebase';

function dataMapper(doc) {
  return {
    ...doc.data(),
    id: doc.id,
  };
}

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
  const { company_name, stand_type, enabled } = data;

  return new Promise(async (resolve, reject) => {
    try {
      const newCompany = await firestore
        .collection('event_companies')
        .doc(eventId)
        .collection('companies')
        .add({
          company_name,
          stand_type,
          enabled,
        });
      resolve(newCompany.id);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateEventCompany = (eventId, companyId, data) => {
  const { company_name, stand_type, enabled } = data;

  return new Promise(async (resolve, reject) => {
    try {
      await firestore
        .collection('event_companies')
        .doc(eventId)
        .collection('companies')
        .doc(companyId)
        .update({
          company_name,
          stand_type,
          enabled,
        });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
