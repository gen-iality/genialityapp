import { useEffect, useState } from 'react';
import EviusReactQuill from '../../shared/eviusReactQuill';
import { EventsApi } from '../../../helpers/request';
import { UseEventContext } from '../../../context/eventContext';
import { Form, Row, Col } from 'antd';
import Header from '../../../antdComponents/Header';
import { DispatchMessageService } from '../../../context/MessageService';
import MenuEvents from '../../menuLanding/utils/defaultMenu.json';

export default function AdmininformativeSection1(props) {
  const eventContext = UseEventContext();
  const [content, setContent] = useState('');
  const [itemsMenus, setItemsMenus] = useState();

  const onFinish = (values) => {
    async function save() {
      let informativeMenu;
      if (itemsMenus.informativeSection1) {
        informativeMenu = itemsMenus.informativeSection1;
      } else {
        informativeMenu = MenuEvents.informativeSection1;
      }
      const informativeMenu1 = { ...informativeMenu, markup: content };

      const data = {
        itemsMenu: {
          ...itemsMenus,
          informativeSection1: informativeMenu1,
        },
      };

      try {
        await EventsApi.editOne(data, eventContext.value._id);
        DispatchMessageService({
          type: 'success',
          msj: 'Guardado',
          action: 'show',
        });
      } catch (e) {
        DispatchMessageService({
          type: 'error',
          msj: e.message,
          action: 'show',
        });
      }
    }
    save();
  };

  useEffect(() => {
    async function getContent() {
      const result = await EventsApi.getOne(eventContext.value._id);
      setItemsMenus(result?.itemsMenu);
      /* console.log('data', result); */
      let markup = result?.itemsMenu?.informativeSection1?.markup || '';
      setContent(markup);
    }
    getContent();
  }, []);

  const handleChangeReactQuill = (e) => {
    setContent(e);
    /* console.log('content', e); */
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
