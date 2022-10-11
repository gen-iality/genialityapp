import { useState } from 'react';

export function useFormItemsTable() {
  const [imgCarton, setImgCarton] = useState('');
  const [imgBalota, setImgBalota] = useState('');

  const formItemsImageTable = [
    {
      name: 'carton_value',
      setImg: setImgCarton,
      imgUrl: imgCarton,
      label: 'Imagen del cartón',
      labelText: 'Valor del cartón',
      width: '550px',
      height: '550px',
    },
    {
      name: 'ballot_value',
      setImg: setImgBalota,
      imgUrl: imgBalota,
      label: 'Imagen de la balota',
      labelText: 'Valor de la balota',
      width: '550px',
      height: '550px',
    },
  ];
  return formItemsImageTable;
}
