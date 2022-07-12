import { Button, Divider, Space } from 'antd';
import ScrollIntoView from 'react-scroll-into-view';

const MenuScrollBlock = ({ sections }) => {
  return (
    <Space size={'large'}>
      {sections &&
        sections
          .filter((section) => section?.status)
          .map((section) => {
            return (
              <>
                <ScrollIntoView selector={`#${section.name}_block`}>
                  <Button type='text' size='large'>
                    {section.name}
                  </Button>
                </ScrollIntoView>
                <Divider type='vertical' />
              </>
            );
          })}
    </Space>
  );
};

export default MenuScrollBlock;
