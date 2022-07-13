import { Button, Divider, Grid, Space } from 'antd';
import ScrollIntoView from 'react-scroll-into-view';

const { useBreakpoint } = Grid;

const MenuScrollBlock = ({ sections }) => {
  const screens = useBreakpoint();

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
              <ScrollIntoView alignToTop={true} selector={`#${section.name}_block`}>
                <Button type='text' size='large'>
                  {createLabel(section.name)}
                </Button>
              </ScrollIntoView>
            );
          })}
    </Space>
  );
};

export default MenuScrollBlock;
