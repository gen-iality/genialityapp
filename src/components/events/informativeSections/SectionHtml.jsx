/* eslint-disable react-hooks/exhaustive-deps */
import { DispatchMessageService } from '@/context/MessageService';
import { UseEventContext } from '@/context/eventContext';
import { EventsApi } from '@/helpers/request';
import { Button, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useState } from 'react';

export default function SectionHtml() {
  const eventContext = UseEventContext();
  const [htmlInput, setHtmlInput] = useState('');
  const [itemsMenus, setItemsMenus] = useState()
  const handleInputChange = (event) => {
    setHtmlInput(event.target.value);
  };
  const onFinish = async () => {
    try {
      const informativeMenuHtml = { ...itemsMenus?.informativeSection, markup: htmlInput };
      const data = {
        itemsMenu: {
          ...itemsMenus,
          informativeSection: informativeMenuHtml,
        },
      };
      await EventsApi.editOne(data, eventContext.value._id);
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
      setItemsMenus(result?.itemsMenu)
      let markup = result?.itemsMenu?.informativeSection?.markup || '';
      setHtmlInput(markup);
    }
    getContent();
  }, []);
  return (
    <>
      <Typography>Ingrese el HTML que deseas mostrar</Typography>
      <TextArea value={htmlInput} onChange={handleInputChange} rows={4} />
      <div dangerouslySetInnerHTML={{ __html: htmlInput }} />
      <Button type='primary' onClick={onFinish}>
        Gruardar
      </Button>
    </>
  );
}
