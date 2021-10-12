import React, { useEffect, useState } from 'react';
import EviusReactQuill from '../../shared/eviusReactQuill';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { EventsApi } from '../../../helpers/request';
import { UseEventContext } from '../../../Context/eventContext';
import { Form ,message, Button  } from 'antd';



export default function AdmininformativeSection1(props) {
  const eventContext = UseEventContext();
  const [content, setContent] = useState('');

  const onFinish = (values) => {
    async function save() {
      console.log('minu',eventContext.value.itemsMenu)
      const data = {
        itemsMenu: {
          ...eventContext.value.itemsMenu,
          informativeSection1: { ...eventContext.value.itemsMenu?.informativeSection1, markup: content },
        },
      };
      console.log('minu',data)

      try{
      const result = await EventsApi.editOne(data, eventContext.value._id);
      message.info('Guardado');
      }catch(e){
        message.info('Error',e.message);
      }
    }
    save();
  };

  useEffect(() => {
    if (eventContext.value.itemsMenu.informativeSection1)
      setContent(eventContext.value.itemsMenu.informativeSection1?.markup);
  }, [eventContext.value]);

  const handleChangeReactQuill = (e) => {
    setContent(e);
  };

  if (eventContext.status === 'LOADING') return 'Loading...';
  if (eventContext.status === 'ERROR') return 'An error has occurred: ';

  return (
    <section>
      <EviusReactQuill name='content' data={content} handleChange={(e) => handleChangeReactQuill(e)} />
      <Form
        //initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
