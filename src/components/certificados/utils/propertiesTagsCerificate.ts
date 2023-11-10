import { eventCertificateTags } from './constants';

export const getPropertiesCertificate = (properties: any) => {
  const filteredPropertiesTags = Object.keys(properties)
    .filter((key) => {
      return key !== 'names' && key !== 'email' && key !== 'list_type_user' && key !== 'rol_id' && key !== 'code';
    })
    .map((key) => {
      return {
        tag: `properties.${key}`,
        label: `Propiedad ${key}`,
        value: key,
      };
    });
  return filteredPropertiesTags;
};

export const getAllEventCertificateTags = (properties: any) => {
  return [...eventCertificateTags, ...getPropertiesCertificate(properties)];
};
