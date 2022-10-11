import { Drawer, Input, PageHeader, Typography } from 'antd';
import { FileProtectOutlined } from '@ant-design/icons';
import { DrawerRulesInterface } from '../../interfaces/bingo';
import { UseEventContext } from '@/context/eventContext';

const { Title } = Typography;

const DrawerRules = ({ showDrawerRules, setshowDrawerRules, bingoData }: DrawerRulesInterface) => {
  /*  console.log('🚀 debug -', HTMLReactParser(bingoData?.regulation ? bingoData?.regulation : '')); */
  let cEvent = UseEventContext();

  return (
    <Drawer
      width={'30vw'}
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
        placeholder={'Reglamento del Bingo'}
        readOnly={true}
        value={bingoData?.regulation ? bingoData?.regulation : ''}
      />
    </Drawer>
  );
};
export default DrawerRules;
