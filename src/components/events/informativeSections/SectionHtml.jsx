/* eslint-disable react-hooks/exhaustive-deps */
import { DispatchMessageService } from '@/context/MessageService';
import { UseEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
import { Button, Col, Divider, Row, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';
// import MenuEvents from '../../menuLanding/utils/defaultMenu.json';
import MenuEvents from '../../menuLanding/utils/defaultMenu';
export default function SectionHtml() {
  const eventContext = UseEventContext();
  const [htmlInput, setHtmlInput] = useState('');
  const [itemsMenus, setItemsMenus] = useState();
  const [show, setShow] = useState(true);

  const handleInputChange = (event) => {
    setHtmlInput(event.target.value);
    setShow(false);
  };

  const onFinish = async () => {
    let informativeMenu;
    if (itemsMenus.informativeSection) {
      informativeMenu = itemsMenus.informativeSection;
    } else {
      informativeMenu = MenuEvents.informativeSection;
    }
    try {
      const informativeMenuHtml = { ...informativeMenu, markup: htmlInput };
      const data = {
        itemsMenu: {
          ...itemsMenus,
          informativeSection: informativeMenuHtml,
        },
      };
      await EventsApi.editOne(data, eventContext.value._id);
      setShow(true);
      DispatchMessageService({
        type: 'success',
        msj: 'Guardado correctamente',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        type: 'error',
        msj: e.message,
        action: 'show',
      });
    }
  };

  useEffect(() => {
    async function getContent() {
      const result = await EventsApi.getOne(eventContext.value._id);
      setItemsMenus(result?.itemsMenu);
      let markup = result?.itemsMenu?.informativeSection?.markup || '';
      setHtmlInput(markup);
    }
    getContent();
  }, []);

  return (
    <>
      <Row justify='space-between' align='center'>
        <Col>
          <Typography.Text strong>Ingrese el HTML que deseas mostrar</Typography.Text>
        </Col>
        <Col>
          <Button type='primary' onClick={onFinish}>
            Guardar
          </Button>
        </Col>
      </Row>
      <br />
      <TextArea value={htmlInput} onChange={handleInputChange} rows={4} className='desplazar' />

      {show && htmlInput && 
        <>
          <Divider />
          <Typography.Text strong>Vista previa</Typography.Text>
          <div style={{maxHeight: '350px', overflowX: 'auto'}} className='desplazar'>
            <div dangerouslySetInnerHTML={{ __html: htmlInput }} style={{height: '100%'}} />
          </div>
        </>
      }
    </>
  );
}
