import React, { useEffect, useState } from 'react';
import EviusReactQuill from '../../shared/eviusReactQuill';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { EventsApi } from '../../../helpers/request';
import { UseEventContext } from '../../../context/eventContext';
import { Form, message, Button, Row, Col } from 'antd';
import Header from '../../../antdComponents/Header';

export default function AdmininformativeSection1(props) {
  const eventContext = UseEventContext();
  const [content, setContent] = useState('');

  const onFinish = (values) => {
    async function save() {
      /* console.log('minu', eventContext.value.itemsMenu); */

      let informativeMenu = {
        name: 'Sección informativa 2',
        position: 30,
        section: 'informativeSection1',
        icon: 'FileDoneOutlined',
        markup: null,
        checked: true,
        permissions: 'public',
      };

      informativeMenu =
        eventContext.value.itemsMenu && eventContext.value.itemsMenu.informativeSection1
          ? eventContext.value.itemsMenu.informativeSection1
          : informativeMenu;
      informativeMenu = { ...informativeMenu, markup: content };
      const data = {
        itemsMenu: {
          ...eventContext.value.itemsMenu,
          informativeSection1: informativeMenu,
        },
      };
      /* console.log('minu', data); */

      try {
        const result = await EventsApi.editOne(data, eventContext.value._id);
        console.log('result', result);
        message.success('Guardado');
      } catch (e) {
        message.error('Error', e.message);
      }
    }
    save();
  };

  useEffect(() => {
    async function getContent() {
      const result = await EventsApi.getOne(eventContext.value._id);
      console.log('data', result);
      let markup = result?.itemsMenu?.informativeSection1?.markup || '';
      setContent(markup);
    }
    getContent();
  }, []);

  const handleChangeReactQuill = (e) => {
    setContent(e);
    console.log('content', e);
  };

  if (eventContext.status === 'LOADING') return 'Loading...';
  if (eventContext.status === 'ERROR') return 'An error has occurred: ';

  return (
    <section>
      <Form onFinish={() => onFinish()} autoComplete='off'>
        <Header title={'Contenido Informativo'} save form />

        <Row justify='center' gutter={8} wrap>
          <Col span={16}>
            <Form.Item>
              <EviusReactQuill name='content' data={content} handleChange={(e) => handleChangeReactQuill(e)} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </section>
  );
}
