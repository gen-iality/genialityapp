import { DispatchMessageService } from '@/context/MessageService';
import { CommentOutlined, FileProtectOutlined } from '@ant-design/icons';
import { Button, Card, Col, Modal, Row, Typography } from 'antd';
import { useBingo } from '@/components/games/bingo/hooks/useBingo';
import { DrawerButtonsInterface } from '../interfaces/bingo';

const DrawerButtons = ({
  arrayLocalStorage,
  postBingoByUser,
  clearCarton,
  setshowDrawerChat = () => {},
  setshowDrawerRules = () => {},
}: DrawerButtonsInterface) => {
  const showModalConfirm = () => {
    Modal.confirm({
      title: '¿Esta seguro que desea limpiar el cartón del bingo?',
      type: 'warning',
      onOk: () => clearCarton(),
      okButtonProps: { type: 'primary', danger: true },
      okText: 'Limpiar cartón',
    });
  };
  const { bingo } = useBingo();
  const bingoColor = bingo?.bingo_appearance.background_color;
  const validateLength = bingo?.dimensions.amount || 25;
  const singBingo = () => {
    DispatchMessageService({
      type: 'success',
      key: 'send',
      msj: '📣 ¡BINGO!',
      action: 'show',
      additionalMessage: false,
    });
    postBingoByUser();
  };

  return (
    <Card bordered={false} style={{ height: '100%', backgroundColor: 'transparent' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row justify='center'>
            <Button
              className={
                arrayLocalStorage.filter((item) => item === 1).length < validateLength
                  ? ''
                  : 'animate__animated animate__heartBeat'
              }
              shape='circle'
              onClick={() => singBingo()}
              style={{
                width: '150px',
                height: '150px',
                border: `10px solid #FF4D4F`,
                boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)',
              }}
              disabled={arrayLocalStorage.filter((item) => item === 1).length < validateLength}
              type='default'>
              <Typography.Text
                strong={arrayLocalStorage.filter((item) => item === 1).length < validateLength ? false : true}>
                ¡BINGO!
              </Typography.Text>
            </Button>
          </Row>
        </Col>
        <Col span={24}>
          <Button
            style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            onClick={() => showModalConfirm()}
            size='large'
            block
            disabled={arrayLocalStorage.filter((item) => item === 1).length === 0}>
            Limpiar carton
          </Button>
        </Col>
        <Col span={24}>
          <Button
            style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            onClick={() => setshowDrawerRules(true)}
            icon={<FileProtectOutlined />}
            size='large'
            block>
            Reglas
          </Button>
        </Col>
        <Col span={24}>
          <Button
            style={{ boxShadow: ' 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
            onClick={() => setshowDrawerChat(true)}
            icon={<CommentOutlined />}
            size='large'
            block>
            Chat
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default DrawerButtons;
