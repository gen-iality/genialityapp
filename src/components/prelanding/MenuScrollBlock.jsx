import { CurrentEventContext } from '@/context/eventContext';
import { Button, Divider, Grid, Space } from 'antd';
import { useContext } from 'react';
import ScrollIntoView from 'react-scroll-into-view';

const { useBreakpoint } = Grid;

const MenuScrollBlock = ({ sections, vdescription, vspeakers, vactividades, vpatrocinadores }) => {
  //CONTEXTO
  const cEvent = useContext(CurrentEventContext);
  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;

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
    if (name == 'Patrocinadores' && vpatrocinadores.length > 0) {
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
      case 'Patrocinadores':
        label = 'Patrocinadores';
        break;
    }
    return label;
  };
  return (
    <Space
      wrap
      size={'large'}
      split={!screens.xs && <Divider style={{ borderLeft: `1px solid ${textColor}` }} type={'vertical'} />}>
      {sections &&
        sections
          .filter((section) => section?.status)
          .map((section) => {
            return (
              visibleSeccion(section.name) && (
                <ScrollIntoView
                  scrollOptions={{ block: 'start' }}
                  key={`section-${section.name}`}
                  alignToTop={true}
                  selector={`#${section.name}_block`}>
                  <Button type='text' size='large' style={{ color: textColor }}>
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
