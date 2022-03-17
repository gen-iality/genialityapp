import React from 'react';
import { typeActivityState } from './interfaces/interfaces';
import { TypeActivityAction } from './types/types';

export const initialState: typeActivityState = {
  openModal: false,
  activityOptions: [
    {
      id: 'type',
      MainTitle: 'Escoge el proveedor de transmision',
      title: 'Titulo del card',
      description: 'Descripción del card',
      image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
      nextView: 'toggleProvider',
    },
    {
      id: 'provider',
      MainTitle: 'Escoge el proveedor de transmision',
      title: 'Titulo del card',
      description: 'Descripción del card',
      image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
      nextView: 'toggleOrigin',
    },
    {
      id: 'origin',
      MainTitle: 'Escoge el origen de transmision',
      title: 'Titulo del card 2',
      description: 'Descripción del card 2',
      image: 'https://img.freepik.com/vector-gratis/plantilla-banner-contraccion-conexion_52683-42130.jpg',
      nextView: 'undefined',
    },
  ],
};

export const typeActivityReducer = (state: typeActivityState, action: TypeActivityAction): typeActivityState => {
  console.log('🚀 debug ~ typeActivityReducer ~ action', action);
  console.log('🚀 debug ~ typeActivityReducer ~ state', state);
  switch (action.type) {
    // case 'type':
    //   return {
    //     ...state,
    //     activityOptions: [...state.activityOptions, action.payload],
    //   };
    case 'toggleType':
      return {
        ...state,
        openModal: true,
        activityOptions: state.activityOptions.filter(({ ...typeActivity }) => {
          return typeActivity.id === action.payload.id;
        }),
      };
    case 'toggleProvider':
      console.log('🚀 debug ~ toggleProvider');
      return;

    case 'toggleOrigin':
      return {
        ...state,
        activityOptions: state.activityOptions.map(({ ...typeActivity }) => {
          console.log('🚀 debug ~ activityOptions:state.activityOptions.map ~ todo', typeActivity);
          return typeActivity;
        }),
      };
    case 'toggleCloseModal':
      return {
        ...state,
        openModal: action.payload,
        activityOptions: initialState.activityOptions,
      };

    default:
      return state;
  }
};
