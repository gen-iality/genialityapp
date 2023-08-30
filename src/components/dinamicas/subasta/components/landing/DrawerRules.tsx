import { Drawer, Grid, Input, PageHeader, Typography } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { DrawerRulesProps } from '../../interfaces/auction.interface';
const { useBreakpoint } = Grid;
const { Title } = Typography;

const DrawerRules = ({ showDrawerRules, setshowDrawerRules, cEvent ,auctionRules}: DrawerRulesProps) => {
  const screens = useBreakpoint();
  return (
    <Drawer
    width={screens.xs || (screens.sm && screens.md) ? '100vw' : '30vw'}
      headerStyle={{ border: 'none' }}
      bodyStyle={{ paddingRight: '10px' }}
      title={
        <PageHeader
          avatar={{
            style: { backgroundColor: cEvent.value?.styles?.toolbarDefaultBg },
            icon: (
              <FileProtectOutlined
                style={{
                  color: cEvent.value?.styles?.textMenu,
                }}
              />
            ),
            shape: 'square',
          }}
          title={<Title level={5}>Reglas del juego</Title>}
          style={{ padding: '0px' }}
        />
      }
      visible={showDrawerRules}
      closable={true}
      onClose={() => setshowDrawerRules(false)}>
      <Input.TextArea
        style={{ padding: '0px' }}
        bordered={false}
        autoSize={{ minRows: 25, maxRows: 25 }}
        cols={20}
        wrap='hard'
        placeholder={'Reglamento de  la subasta'}
        readOnly={true}
        value={auctionRules}
      />
    </Drawer>
  );
};
export default DrawerRules;
