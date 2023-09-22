import React, { useEffect, useState } from 'react';
import * as servicesMeenting from '../services/meenting.service';
import { ISpacesFirebase } from '../interfaces/spaces-interfaces';
import { UseEventContext } from '@/context/eventContext';

export const useGetSpaces = () => {
  const [loading, setLoading] = useState(true);
  const [spaces, setSpaces] = useState<ISpacesFirebase[]>([]);
  const eventContext = UseEventContext();

  const onSetSpaces = (spaces: ISpacesFirebase[]) => {
    setLoading(false);
    setSpaces(spaces);
  };

  useEffect(() => {
    const unSubscribeSpaces = servicesMeenting.listenSpacesByEventId(eventContext.value._id, onSetSpaces);
    return () => {
      unSubscribeSpaces();
    };
  }, []);

  return {
    spaces,
    loading,
  };
};
