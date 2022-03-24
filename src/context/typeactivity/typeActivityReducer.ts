import { typeActivityData } from './constants/constants';
import { TypeActivityState } from './interfaces/interfaces';
import { TypeActivityAction } from './types/types';
import { isValidUrl } from '../../hooks/useIsValidUrl';

export const initialState: TypeActivityState = {
  openModal: false,
  disableNextButton: true,
  typeOptions: typeActivityData,
  selectedKey: 'initial',
  previewKey: 'type',
  data: '',
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

    case 'initial':
      return {
        openModal: action.payload?.activityState ? (action.payload?.activityState?.selectedKey ? false : true) : false,
        disableNextButton: true,
        typeOptions: typeActivityData,
        selectedKey: action.payload ? action.payload?.activityState?.selectedKey : 'initial',
        previewKey: action.payload ? action.payload?.activityState?.previewKey : 'type',
        data: action.payload ? action.payload?.activityState?.data : '',
        buttonsTextNextOrCreate: action.payload?.activityState?.selectedKey ? '' : 'Siguiente',
        buttonTextPreviousOrCancel: action.payload?.activityState?.selectedKey ? '' : 'Cancel',
      };
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
      const selectedToggleLiveBroadcastData = state.typeOptions.typeOptions.find((item: { key: string }) => {
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
          selectedKey: '',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Cancelar',
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
          selectedKey: '',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Cancelar',
          typeOptions: selectedToggleLiveBroadcastData,
        };
      }

    case 'toggleMeeting':
      const selectedToggleMeetingData = state.typeOptions?.typeOptions?.find((item: { key: string }) => {
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
      let preValidateState: [] = state.typeOptions?.typeOptions ? state.typeOptions.typeOptions : [];
      const selectedToggleVideoData = preValidateState.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });
      console.log(
        '🚀 debug ~ selectedToggleVideoData ~ selectedToggleVideoData',
        selectedToggleVideoData,
        state.typeOptions.key
      );

      if ((state.typeOptions.key === 'cargarvideo' || state.typeOptions.key === 'url') && !selectedToggleVideoData) {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: '',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: initialState.typeOptions.typeOptions[2],
        };
      }

      if (selectedToggleVideoData) {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: action.payload.id,
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectedToggleVideoData,
        };
      } else {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: '',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Cancelar',
          typeOptions: initialState.typeOptions,
        };
      }

    case 'toggleCargarvideo':
      const selectedtToggleCargarvideo = state.typeOptions.typeOptions.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      return {
        ...state,
        openModal: true,
        disableNextButton: true,
        previewKey: state.previewKey,
        selectedKey: '',
        buttonsTextNextOrCreate: 'Crear',
        buttonTextPreviousOrCancel: 'Anterior',
        typeOptions: selectedtToggleCargarvideo,
      };

    case 'toggleUrl':
      console.log('🚀 KEYYYYYYYYYYYYYYYYY ', state, state.typeOptions.typeOptions);
      let preValidateStates: [] = state.typeOptions?.typeOptions.length > 1 ? state.typeOptions.typeOptions : [];
      const selectedToggleUrl = preValidateStates.find((item: { key: string }) => {
        if (item.key === action.payload.id) return item;
      });

      if (!selectedToggleUrl && state.typeOptions?.typeOptions.length === 1) {
        console.log('🚀 debug ~ -----------------------------+-+-+-+-+-');

        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: 'video',
          selectedKey: '',
          buttonsTextNextOrCreate: 'Siguiente',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: initialState.typeOptions.typeOptions[2],
        };
      }

      if (selectedToggleUrl) {
        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: '',
          buttonsTextNextOrCreate: 'Crear',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: selectedToggleUrl,
        };
      } else {
        console.log('🚀 debug ~ -----------------------------ELSE');

        return {
          ...state,
          openModal: true,
          disableNextButton: true,
          previewKey: state.previewKey,
          selectedKey: '',
          buttonsTextNextOrCreate: 'Crear',
          buttonTextPreviousOrCancel: 'Anterior',
          typeOptions: initialState.typeOptions.typeOptions[2],
        };
      }

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
          selectedKey: '',
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

    case 'toggleFinish':
      return {
        ...state,
        openModal: false,
        previewKey: state.selectedKey,
        selectedKey: action.payload.id,
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

    case 'selectCargarVideo':
      return {
        ...state,
        openModal: true,
        disableNextButton: false,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: state.typeOptions,
      };

    case 'selectUrl':
      console.log('🚀 STATE', state);
      console.log('🚀 ACTION', action);
      console.log('🚀 INITIAL', initialState.typeOptions);
      let disableButton: boolean = true;

      const sendDataPayload = action?.payload?.sendData;
      if ((sendDataPayload?.length > 12 && sendDataPayload !== '') || sendDataPayload == undefined) {
        disableButton = false;
        if (sendDataPayload) {
          console.log('🚀 sendData ~ isValidUrl ~ isValidUrl', isValidUrl(sendDataPayload));
        }
      }
      return {
        ...state,
        openModal: true,
        disableNextButton: disableButton,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: state.typeOptions,
        data: action.payload.sendData,
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
      let disableButtonVimeo: boolean = true;

      const sendDataPayloadVimeo = action?.payload?.sendData;
      if ((sendDataPayloadVimeo?.length > 12 && sendDataPayloadVimeo !== '') || sendDataPayloadVimeo == undefined) {
        disableButtonVimeo = false;
        if (sendDataPayloadVimeo) {
          console.log('🚀 sendData ~ isValidUrl ~ isValidUrl', isValidUrl(sendDataPayloadVimeo));
        }
      }
      return {
        ...state,
        openModal: true,
        disableNextButton: disableButtonVimeo,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: state.typeOptions,
        data: action.payload.sendData,
      };

    case 'selectYouTube':
      let disableButtonYoutube: boolean = true;

      const sendDataPayloadYoutube = action?.payload?.sendData;
      if (
        (sendDataPayloadYoutube?.length > 12 && sendDataPayloadYoutube !== '') ||
        sendDataPayloadYoutube == undefined
      ) {
        disableButtonYoutube = false;
        if (sendDataPayloadYoutube) {
          console.log('🚀 sendData ~ isValidUrl ~ isValidUrl', isValidUrl(sendDataPayloadYoutube));
        }
      }
      return {
        ...state,
        openModal: true,
        disableNextButton: disableButtonYoutube,
        previewKey: state.typeOptions.key,
        selectedKey: action.payload.id,
        typeOptions: state.typeOptions,
        data: action.payload.sendData,
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
