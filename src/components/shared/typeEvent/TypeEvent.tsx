import { Fragment, useEffect, useState } from 'react';
import { Card, Col, Form, Input, Select, Space } from 'antd';
import { typeEvent } from './interfaces/interfaces';

const { Item } = Form;
const { Option } = Select;

const defaultEvent = {
  type_event: null,
  address: null,
  venue: null,
  url_external: null,
  where_it_run: null,
};

const TypeEvent = ({
  loading = false,
  event = defaultEvent,
  handleFormDataOfEventType = () => {},
  isCms = false,
}: typeEvent) => {
  const [typeEvent, setTypeEvent] = useState<string | null>('onlineEvent');
  const [whereItRun, setWhereItRun] = useState<string | null>('InternalEvent');

  const { type_event, address, venue, url_external, where_it_run } = event;
  const sizeInput = isCms ? 'large' : 'middle';
  const TagDinamic = isCms ? Space : Fragment;

  const changesToFormValues = async (values: EventListenerObject) => {
    handleFormDataOfEventType(values);
  };

  useEffect(() => {
    setTypeEvent(type_event);
    setWhereItRun(where_it_run);
  }, [event]);

  return (
    <Col span={24}>
      <Card
        bordered={isCms}
        hoverable={isCms}
        bodyStyle={isCms ? {} : { padding: '0px' }}
        style={{
          borderRadius: '20px',
          cursor: 'auto',
          marginBottom: '20px',
        }}
        loading={loading}>
        <Form layout='vertical' onValuesChange={changesToFormValues}>
          <TagDinamic
            size={sizeInput}
            direction='vertical'
            style={{
              width: '100%',
            }}>
            <Item label={'Tipo de evento'} name={'type_event'}>
              <Select
                defaultValue={type_event}
                value={typeEvent}
                onChange={(e) => setTypeEvent(e)}
                size={sizeInput}
                placeholder='Tipo de evento'
                style={{
                  width: '100%',
                }}>
                <Option value='physicalEvent'>Evento físico</Option>
                <Option value='onlineEvent'>Evento virtual</Option>
                <Option value='hybridEvent'>Evento híbrido</Option>
              </Select>
            </Item>
            {typeEvent && typeEvent !== 'physicalEvent' && typeEvent !== '' && (
              <Item label={'Donde se llevará a cabo el evento?'} name={'where_it_run'}>
                <Select
                  defaultValue={where_it_run}
                  value={whereItRun}
                  onChange={(e) => setWhereItRun(e)}
                  size={sizeInput}
                  placeholder='Donde se llevará a cabo el evento?'
                  style={{
                    width: '100%',
                  }}>
                  <Option value='InternalEvent'>En Evius</Option>
                  <Option value='ExternalEvent'>En otra plataforma</Option>
                </Select>
              </Item>
            )}

            {whereItRun === 'ExternalEvent' && typeEvent !== 'physicalEvent' && typeEvent !== '' && (
              <Item label={'Url Externa'} name={'url_external'} initialValue={url_external}>
                <Input placeholder={'https://example.com'} />
              </Item>
            )}
            {typeEvent && typeEvent !== 'onlineEvent' && typeEvent !== '' && (
              <TagDinamic
                size={sizeInput}
                direction='vertical'
                style={{
                  width: '100%',
                }}>
                <Item label={'Dirección'} name={'address'} initialValue={address}>
                  <Input placeholder={'¿Cuál es la dirección del evento?'} />
                </Item>

                <Item label={'Lugar'} name={'venue'} initialValue={venue}>
                  <Input placeholder={'Nombre del lugar del evento'} />
                </Item>
              </TagDinamic>
            )}
          </TagDinamic>
        </Form>
      </Card>
    </Col>
  );
};

export default TypeEvent;
