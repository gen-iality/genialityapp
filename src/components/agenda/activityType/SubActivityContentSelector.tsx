import * as React from 'react';
import { useState, useEffect, useContext } from 'react';

import { Card, Result, Button, Alert, Row, Col, Space } from 'antd';

import InitialSVG from '../typeActivity/components/svg/InitialSVG';
import { AgendaApi, TypesAgendaApi } from '@/helpers/request';
import { useMutation, useQueryClient } from 'react-query';
import { createLiveStream, stopLiveStream } from '../../../adaptors/gcoreStreamingApi';

import AgendaContext from '../../../context/AgendaContext';

import {
  activitySubTypeKeys,
  activityTypeData,
  activityTypeKeys,
} from '@/context/activityType/schema/activityTypeFormStructure';
import {
  ActivityTypeCard,
  FormStructure,
  WidgetType,
  ActivitySubTypeNameType,
  GeneralTypeName,
  GeneralTypeValue,
} from '@/context/activityType/schema/structureInterfaces';
import ActivityContentManager from './ActivityContentManager';
import { ExtendedAgendaDocumentType } from '../types/AgendaDocumentType';
import ActivityContentModal from './ActivityContentModal';

import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';

export interface SubActivityContentSelectorProps {
  activityId: string,
  eventId: string,
  activityName: string,
  shouldLoad: boolean,
};

function SubActivityContentSelector(props: SubActivityContentSelectorProps) {
  const {
    activityId,
    eventId,
    activityName,
    shouldLoad
  } = props;

  const [modalTitle, setModalTitle] = useState('Contenido');
  const [isModalShown, setIsModalShown] = useState(false);
  const [initialType, setInitialType] = useState<ActivitySubTypeNameType | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<GeneralTypeValue | undefined>(undefined);
  const [definedType, setDefinedType] = useState<GeneralTypeValue | undefined>(undefined);
  const [currentWidget, setCurrentWidget] = useState<ActivityTypeCard | FormStructure | undefined>(undefined);
  const [input, setInput] = useState('');

  const queryClient = useQueryClient();

  const { selectOption } = useTypeActivity();

  const {
    saveConfig,
    deleteTypeActivity,
    setMeetingId,
    setPlatform,
    setTypeActivity,
    activityDispatch,
    dataLive,
    meeting_id,
    setDataLive,
    setHabilitarIngreso,
  } = useContext(AgendaContext);

  /**
   * TODO: use useState to consult the activity type, and check if it has the
   *       resources to each activity type.
   */
  useEffect(() => {
    if (!shouldLoad) return;

    console.log('ask for activity type');

    (async () => {
      const agendaInfo: ExtendedAgendaDocumentType = await AgendaApi
        .getOne(activityId, eventId);
      // setDefinedType(agendaInfo.type?.name || null);
      const typeIncomming = agendaInfo.type?.name;
      console.log('current agenda has activity type:', typeIncomming);
      setInitialType(typeIncomming as ActivitySubTypeNameType | undefined);

      let index;
      switch (typeIncomming) {
        case activityTypeKeys.live:
          index = 0;
          break;
        case activityTypeKeys.meeting:
          index = 1;
          break;
        case activityTypeKeys.video:
          index = 2;
          break;
        default:
          // return alert(`No puede reconocer actividad de tipo "${typeIncomming}"`)
          // TODO: maybe it use a specify activity type...
          // TODO: ask for meeting_id, platform, etc.
          break;
      }

      if (index !== undefined) {
        // Set the title, and the data to the views
        const currentOpenedCard: ActivityTypeCard = activityTypeData.cards[index];
        console.log('opened widget is:', currentOpenedCard);
        setModalTitle(currentOpenedCard.MainTitle);

        if (currentOpenedCard.widgetType === WidgetType.FORM) {
          console.debug('Pass the form widget')
          setCurrentWidget(currentOpenedCard.form);
        } else {
          console.debug('Whole widget was passed');
          setCurrentWidget(currentOpenedCard);
        }
      } else {
        setDefinedType(typeIncomming as GeneralTypeValue | undefined);
      }
    })();
  }, [shouldLoad]);

  useEffect(() => {
    if (selectedType !== undefined) {
      console.log('we can work with', selectedType);
      if (input) selectOption(selectedType, input);
      handleConfirm();
    }
  }, [selectedType]);

  const executer_createStream = useMutation(() => createLiveStream(activityName), {
    onSuccess: async (data: any) => {
      queryClient.setQueryData('livestream', data);

      await saveConfig({ platformNew: 'wowza', type: selectedType, data: data.id });
      setDataLive(data);
      activityDispatch({ type: 'meeting_created', meeting_id: data.id });
      // Invalidate and refetch
      //queryClient.invalidateQueries('todos')
    },
  });

  const handleCloseModal = (success: boolean = false) => {
    setIsModalShown(false);
    // if (success) saveActivityType();
  };

  const handleConfirm = () => {
    // NOTE: use that or use handleCloseModal(success=true)
    console.log('confirm...', 'type:', selectedType, 'input:', input);

    // TODO: process data, save them, and define defineType to enable the other form...
    setDefinedType(selectedType);

    (async () => {
      switch (selectedType) {
        case activitySubTypeKeys.url: {
          const respUrl = await AgendaApi.editOne({ video: input }, props.activityId, props.eventId);
          if (respUrl) {
            await saveConfig({
              platformNew: '',
              type: activitySubTypeKeys.url,
              habilitar_ingreso: '',
              data: input,
            });
            setTypeActivity(activitySubTypeKeys.url);
            setPlatform('wowza');
            setMeetingId(input);
          }
          break;
        }
        case activitySubTypeKeys.vimeo: {
          const resp = await saveConfig({ platformNew: 'vimeo', type: 'vimeo', data: input });
          setTypeActivity(activitySubTypeKeys.vimeo);
          setPlatform(activitySubTypeKeys.vimeo);
          setMeetingId(input);
          break;
        }
        case activitySubTypeKeys.youtube: {
          let newData = input.includes('https://youtu.be/')
            ? input
            : 'https://youtu.be/' + input;
          const resp = await saveConfig({ platformNew: 'wowza', type: activitySubTypeKeys.youtube, data: newData });
          setTypeActivity('youTube');
          setPlatform('wowza');
          setMeetingId(input);
          break;
        }
        case activitySubTypeKeys.meeting: {
          const resp = await saveConfig({
            platformNew: '',
            type: activitySubTypeKeys.meeting,
            data: input,
            habilitar_ingreso: 'only',
          });
          setTypeActivity(activitySubTypeKeys.meeting);
          setPlatform('wowza');
          break;
        }
        case activitySubTypeKeys.file: {
          const data = input.split('*');
          const urlVideo = data[0];
          const respUrlVideo = await AgendaApi.editOne({ video: urlVideo }, props.activityId, props.eventId);
          if (respUrlVideo) {
            const resp = await saveConfig({ platformNew: '', type: 'video', data: urlVideo, habilitar_ingreso: '' });
            setTypeActivity('video');
            setPlatform('wowza');
            setMeetingId(urlVideo);
          }
          break;
        }
        case 'eviusMeet': {
          !meeting_id && executer_createStream.mutate();
          meeting_id &&
            (await saveConfig({
              platformNew: 'wowza',
              type: selectedType,
              data: meeting_id,
            }));
          setTypeActivity('eviusMeet');
          setPlatform('wowza');
          break;
        }
        case 'RTMP': {
          !meeting_id && executer_createStream.mutate();
          meeting_id &&
            (await saveConfig({ platformNew: 'wowza', type: selectedType, data: meeting_id }));
          setTypeActivity('RTMP');
          setPlatform('wowza');
          break;
        }
        default:
          alert(`wtf is ${selectedType}`);
      }
    })();
  }

  const saveActivityType = () => {
    console.log('Saving... nothing for now!');
  };

  const handleInput = (text: string) => {
    console.log('text will:', text);
    setInput(text);
  };

  if (initialType === undefined) {
    return <Alert message='Primero asigne un tipo de actividad' type='error' />
  }

  if (definedType === undefined) {
    return (
      <>
      {currentWidget === undefined && (
        <Alert
          type='error'
          message='No puede cargar el tipo de actividad'
        />
      )}
      {currentWidget !== undefined && (
      <ActivityContentModal
        initialType={initialType}
        visible={isModalShown}
        title={modalTitle}
        widget={currentWidget}
        onClose={handleCloseModal}
        onSelecType={setSelectedType}
        activityName={props.activityName}
        onInput={handleInput}
        // onConfirm={handleConfirm}
      />
      )}
      <Card>
        <Row align='middle' style={{textAlign: 'center'}}>
          <Col span={24} style={{marginBottom: '1em'}}>
            <h2>Todavía no has agregado el contenido a la actividad</h2>
          </Col>
          <Col span={24} style={{marginBottom: '1em'}}>
            <Button onClick={() => setIsModalShown(true)} type='primary'>
              Agregar contenido
              {initialType && `: ${initialType}`}
            </Button>
          </Col>
          <Col span={24} style={{marginBottom: '1em'}}>
            <InitialSVG style={{ width: '255px', height: '277px' }} />
          </Col>
        </Row>
        {/* <Result
          icon={<InitialSVG style={{ width: '255px', height: '277px' }} />}
          status='info'
          title='Todavía no has agregado el contenido a la actividad'
          extra={
            <Button onClick={() => setIsModalShown(true)} type='primary'>
              Agregar contenido
              {initialType && `: ${initialType}`}
            </Button>
          }
        /> */}
      </Card>
      </>
    );
  }

  return (
    <>
      <p>Contenido: {definedType}</p>
      <Button
        danger
        onClick={() => setDefinedType(undefined)}
      >
        Eliminar contenido
      </Button>
      <ActivityContentManager/>
    </>
  );
}

export default SubActivityContentSelector;
