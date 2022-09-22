import { CurrentEventContext } from '@/context/eventContext';
import { CloseOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Collapse, Grid, List, Space, Typography } from 'antd';
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
  return screens.xs ? (
    <Collapse
      className='menu__prelanding'
      expandIcon={({ isActive }) =>
        isActive ? (
          <CloseOutlined style={{ fontSize: '24px', color: textColor }} />
        ) : (
          <MenuOutlined style={{ fontSize: '24px', color: textColor }} />
        )
      }
      ghost
      style={{ width: '100%', backgroundColor: bgColor }}>
      <Collapse.Panel
        style={{ backgroundColor: bgColor }}
        header={
          <Typography.Text strong style={{ fontSize: '24px', color: textColor }}>
            Menu
          </Typography.Text>
        }
        key='1'>
        <List
          dataSource={sections && sections.filter((section) => section?.status)}
          renderItem={(section) =>
            visibleSeccion(section.name) && (
              <ScrollIntoView
                scrollOptions={{ block: 'start' }}
                key={`section-${section.name}`}
                alignToTop={true}
                selector={`#${section.name}_block`}>
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Typography.Text strong style={{ color: textColor, fontSize: '16px' }}>
                        {createLabel(section.name)}
                      </Typography.Text>
                    }
                  />
                </List.Item>
              </ScrollIntoView>
            )
          }
        />
      </Collapse.Panel>
    </Collapse>
  ) : (
    <Space wrap size={'large'}>
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
                  <Button type='text' size='large' style={{ color: textColor, fontWeight: '700' }}>
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
