import { useState } from 'react';


type Actions<Type, T> = {
  [Property in Type as `open${Capitalize<string & Property>}Modal`]: () => void;
} & {
  [Property in Type as `close${Capitalize<string & Property>}Modal`]: () => void;
}& {
  [Property in Type as `isOpen${Capitalize<string & Property>}Modal`]:boolean;
}& {
  [Property in Type as `selected${Capitalize<string & Property>}`]:T | undefined;
}
& {
  [Property in Type as `handledSelect${Capitalize<string & Property>}`]:(item:T)=>void;
};


export const useModalLogic = <T = any, K extends string = string>(nameModal: K): Actions<K, T> => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T>()

  const functions: Actions<K, T> = {
    [`open${nameModal}Modal`]: () => {
      setIsOpenModal(true);
    },
    [`close${nameModal}Modal`]: () => {
      setIsOpenModal(false);
    },
    [`isOpen${nameModal}Modal`]: isOpenModal,
    [`selected${nameModal}`]: selectedItem,
    [`handledSelect${nameModal}`]: setSelectedItem,
  } as Actions<K, T>;


  return functions;
};
