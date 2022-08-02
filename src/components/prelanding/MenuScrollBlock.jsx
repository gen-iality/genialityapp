import { CurrentEventContext } from '@/context/eventContext';
import { Button, Divider, Grid, Space } from 'antd';
import { useContext } from 'react';
import ScrollIntoView from 'react-scroll-into-view';

const { useBreakpoint } = Grid;

const MenuScrollBlock = ({ sections, vdescription, vspeakers, vactividades }) => {
  //CONTEXTO
  const cEvent = useContext(CurrentEventContext);

  const screens = useBreakpoint();
  //PERMITE CONTROLAR SI LA SECCION TIENE CONTENIDO O NO
  const visibleSeccion = (name) => {
    if (name == 'Descripción' && vdescription.length > 0) {
      return true;
    }
    if (name == 'Conferencistas' && vspeakers.length > 0) {
      return true;
    }
    if (name == 'Contador') {
      return true;
    }
    if (name == 'Actividades' && vactividades.length > 0) {
      return true;
    }
    return false;
  };

  const createLabel = (name) => {
    let label;
    switch (name) {
      case 'Contador':
        label = 'Contador';
        break;
      case 'Descripción':
        label = 'Descripción';
        break;
      case 'Conferencistas':
        label = 'Conferencistas';
        break;
      case 'Actividades':
        label = 'Actividades';
        break;
    }
    return label;
  };
  return (
    <Space
      wrap
      size={'large'}
      split={!screens.xs && <Divider style={{ borderLeft: '1px solid black' }} type={'vertical'} />}>
      {sections &&
        sections
          .filter((section) => section?.status)
          .map((section) => {
            return (
              visibleSeccion(section.name) && (
                <ScrollIntoView key={`section-${section.name}`} alignToTop={true} selector={`#${section.name}_block`}>
                  <Button type='text' size='large'>
                    {createLabel(section.name)}
                  </Button>
                </ScrollIntoView>
              )
            );
          })}
    </Space>
  );
};

export default MenuScrollBlock;
