import { Avatar, Button, Card, ConfigProvider, Empty, Input, List, Result, Tabs, Typography } from 'antd';
import { NotificationItemInterface, WinnersValidationCardInterface } from '../interfaces/bingo';
import ListStatusIcon from '@2fd/ant-design-icons/lib/ListStatus';
import InformationOutlineIco from '@2fd/ant-design-icons/lib/InformationOutline';
import CheckCircleOutlineIco from '@2fd/ant-design-icons/lib/CheckCircleOutline';

const { TabPane } = Tabs;
const { Item } = List;
const { Meta } = Item;
const { Title } = Typography;

const WinnersValidationCard = ({
  event,
  notifications,
  inputValidate,
  setInputValidate,
  validarBingo,
  dimensions,
}: WinnersValidationCardInterface) => {
  return (
    <Card hoverable style={{ borderRadius: '20px', height: '100%' }}>
      <Tabs defaultActiveKey='1' centered>
        <TabPane tab='Solicitudes de bingo' key='1'>
          <ConfigProvider renderEmpty={() => <Empty description='No han gritado bingo' />}>
            <List
              itemLayout='horizontal'
              dataSource={notifications}
              renderItem={(item: NotificationItemInterface, index: number) => (
                <Item
                  key={item.cardId}
                  actions={[
                    <>
                      {item.hasWon ? (
                        ''
                      ) : (
                        <Button
                          onClick={() => validarBingo({ userNotification: item, event, dimensions })}
                          type='primary'>
                          Validar
                        </Button>
                      )}
                    </>,
                  ]}>
                  <Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: item.hasWon ? '#1cdcb7' : '#008cff' }}
                        icon={item.hasWon ? <CheckCircleOutlineIco /> : <InformationOutlineIco />}
                      />
                      // <Avatar size={40} style={{ backgroundColor: '#1cdcb7' }}>
                      //   {item.hasWon ? '🎉' : ''}
                      // </Avatar>
                    }
                    title={item.names}
                    description={item.cardId}
                  />
                </Item>
              )}
            />
          </ConfigProvider>
        </TabPane>
        <Tabs.TabPane tab='Validador de cartones' key='2'>
          <Result
            icon={<ListStatusIcon />}
            title={<Title level={4}>Ingresa el codigo del Bingo</Title>}
            subTitle={
              <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                <Input required value={inputValidate} onChange={(e: any) => setInputValidate(e.target.value)} />
              </div>
            }
            extra={
              <Button
                type='primary'
                onClick={() => validarBingo({ manualValidationId: inputValidate, event, dimensions })}>
                Validar
              </Button>
            }
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default WinnersValidationCard;
