import { Drawer, Grid, Input, PageHeader, Typography } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { DrawerRulesProps } from '../../interfaces/auction.interface';
import useBreakpoint from 'use-breakpoint'

/* const { useBreakpoint } = Grid; */
const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 }
const { Title } = Typography;

const DrawerRules = ({ showDrawerRules, setshowDrawerRules, cEvent ,auctionRules}: DrawerRulesProps) => {
  /* const screens = useBreakpoint(); */
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop')

  return (
    <Drawer
      width={breakpoint === 'desktop' ? '30vw' : '100vw'}
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
