import React from 'react';
import { typeActivityData } from './constants/constants';
import { TypeActivityState } from './interfaces/interfaces';
import { TypeActivityAction } from './types/types';

export const initialState: TypeActivityState = {
  openModal: false,
  disableNextButton: true,
  typeOptions: typeActivityData,
  selectedKey: 'initial',
  previewKey: 'type',
  buttonsTextNextOrCreate: 'Siguiente',
  buttonTextPreviousOrCancel: 'Cancel',
};

export const typeActivityReducer = (state: TypeActivityState, action: TypeActivityAction): TypeActivityState => {
  console.log('🚀 REDUCER ACTIONTYPE ', action.type);
  switch (action.type) {
    // case 'type':
    //   return {
    //     ...state,
    //     typeOptions: [...state.typeOptions, action.payload],
    //   };

    case 'toggleType':
      return {
        ...state,
        openModal: true,
        previewKey: 'close',
        selectedKey: 'initial',
        buttonsTextNextOrCreate: 'Siguiente',
        buttonTextPreviousOrCancel: 'Cancel',
        typeOptions: initialState.typeOptions,
      };

    case 'toggleLiveBroadcast':
      // console.log('🚀 STATE', state);
      // console.log('🚀 ACTION', action);
      // console.log('🚀 INITIAL', initialState.typeOptions);

      console.log('🚀 KEY', state.typeOptions.key);
      const selectedToggleLiveBroadcastData = state.typeOptions.typeOptions.find((item: { key: string }) => {
        console.log('🚀 ITEM', item);
        if (item.key === action.payload.id) return item;
      });

      if (selectedToggleLiveBroadcastData) {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: action.payload.id,
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectedToggleLiveBroadcastData,
        };
      } else if (state.typeOptions.key === 'liveBroadcast') {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: action.payload.id,
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: initialState.typeOptions,
        };
      } else {
        const selectedToggleLiveBroadcastData = initialState.typeOptions.typeOptions.find((item: { key: string }) => {
          if (item.key === action.payload.id) return item;
        });
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: action.payload.id,
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectedToggleLiveBroadcastData,
        };
      }

    case 'toggleMeeting':
      const selectedToggleMeetingData = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.previewKey,
        selectedKey: action.payload.id,
        buttonsTextNextOrCreate: 'Crear',
        buttonTextPreviousOrCancel: 'Anterior',
        typeOptions: selectedToggleMeetingData,
      };

    case 'toggleVideo':
      const selectedtoggleVideoData = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      return {
        ...state,
        openModal: true,
        disableNextButton: true,
        previewKey: state.previewKey,
        selectedKey: action.payload.id,
        buttonsTextNextOrCreate: 'Siguiente',
        buttonTextPreviousOrCancel: 'Anterior',
        typeOptions: selectedtoggleVideoData,
      };

    case 'toggleEviusStreaming':
      const selectToggleEviusStreaming = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });
      if (selectToggleEviusStreaming) {
        console.log('🚀 AQUIIIIIIIIIIIIIIIIIIIIIIIIIII', selectToggleEviusStreaming);
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: action.payload.id,
          buttonsTextNextOrCreate: 'Crear',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectToggleEviusStreaming,
        };
      } else {
        const findData = initialState.typeOptions.typeOptions;
        const selectToggleEviusStreaming = findData.find((item: { key: string }) => {
          if (item.key === 'liveBroadcast') return item;
        });

        return {
          ...state,
          openModal: true,
          disableNextButton: true,

          previewKey: 'type',
          selectedKey: 'liveBroadcast',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectToggleEviusStreaming,
        };
      }

    case 'toggleVimeo':
      const selectToggleVimeo = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      return {
        ...state,
        openModal: true,
        disableNextButton: true,
        previewKey: state.previewKey,
        selectedKey: action.payload.id,
        buttonsTextNextOrCreate: 'Crear',
        buttonTextPreviousOrCancel: 'Anterior',
        typeOptions: selectToggleVimeo,
      };
    case 'toggleYouTube':
      const selectToggleYouTube = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      return {
        ...state,
        openModal: true,
        disableNextButton: true,
        previewKey: state.previewKey,
        selectedKey: action.payload.id,
        buttonsTextNextOrCreate: 'Crear',
        buttonTextPreviousOrCancel: 'Anterior',
        typeOptions: selectToggleYouTube,
      };

    case 'toggleCloseModal':
      return {
        ...state,
        disableNextButton: true,
        openModal: action.payload,
        typeOptions: initialState.typeOptions,
      };

    case 'selectLiveBroadcast':
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: initialState.typeOptions,
      };

    case 'selectMeeting':
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: initialState.typeOptions,
      };

    case 'selectVideo':
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: initialState.typeOptions,
      };

    case 'selectEviusStreaming':
      const selectEviusStreaming = initialState.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === state.typeOptions.key) return item;
      });
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: selectEviusStreaming,
      };

    case 'selectVimeo':
      const selectVimeo = initialState.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === state.typeOptions.key) return item;
      });
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: selectVimeo,
      };

    case 'selectYouTube':
      const selectYouTube = initialState.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === state.typeOptions.key) return item;
      });
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: selectYouTube,
      };

    case 'selectEviusMeet':
      // console.log('🚀 STATE', state);
      // console.log('🚀 ACTION', action);
      // console.log('🚀 INITIAL', initialState.typeOptions);

      const selectEviusMeet = state.typeOptions;

      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: selectEviusMeet,
      };

    case 'selectRTMP':
      const selectRTMP = state.typeOptions;
      // .find((item: { key: string }) => {
      //   if (item.key === action.payload.id) return item;
      // });
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: selectRTMP,
      };

    default:
      console.log('🚀 FUERA DEL ESTADO');
      break;
  }
};
