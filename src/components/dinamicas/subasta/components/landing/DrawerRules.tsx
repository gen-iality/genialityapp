import { Drawer, Input, PageHeader, Typography } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { DrawerRulesProps } from '../../interfaces/auction.interface';
import useBreakpoint from 'use-breakpoint';
import { RexUrlValidator } from '@/hooks/useIsValidUrl';
const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };
const { Title } = Typography;

const DrawerRules = ({ showDrawerRules, setshowDrawerRules, cEvent, auctionRules }: DrawerRulesProps) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, 'desktop');

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
      <div style={{ padding: '0px', width: "100%"}}>
        {auctionRules.split('\n').map((item, i) => {
          return (
            <p key={item}>
              {item.split(' ').map((words, i) => {;
                if (RexUrlValidator(words)) return <a href={!words.includes('https') ? `https://${words}` : words} target='_blank' rel="noreferrer">{words + ' '}</a>;
                return words + ' ';
              })}
            </p>
          );
        })}
      </div>
    </Drawer>
  );
};
export default DrawerRules;
