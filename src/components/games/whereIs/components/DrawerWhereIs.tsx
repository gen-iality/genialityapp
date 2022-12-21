import { Button, Drawer, Grid, Row, Space } from 'antd';
import { ReactNode, useState } from 'react';
import useWhereIs from '../hooks/useWhereIs';
import useWhereIsInLanding from '../hooks/useWhereIsInLanding';
import FooterWithHints from './landing/FooterWithHints';
import Lifes from './landing/Lifes';
import Timer from './landing/Timer';

interface Props {
  children: ReactNode;
}

const { useBreakpoint } = Grid;

export default function DrawerWhereIs(props: Props) {
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const { whereIs } = useWhereIs();
  const { goTo, location } = useWhereIsInLanding();

  const handleOpen = () => {
    setOpen(true);
    goTo('introduction');
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        size='large'
        type='primary'
        onClick={handleOpen}
        style={{ display: !!whereIs && whereIs?.published ? 'block' : 'none' }}>
        Buscando el elemento
      </Button>
      <Drawer
        title={
          <Row align='middle' justify='space-between' >
            <Timer />
            {!screens.xs && location.activeView === 'game' ? <FooterWithHints /> : undefined}
			<Lifes />
          </Row>
        }
        visible={open}
        bodyStyle={{
          padding: location.activeView === 'game' ? '0px' : screens.xs ? '5px' : '24px',
        }}
        headerStyle={{
          padding: 12,
        }}
        
        footer={screens.xs ? location.activeView === 'game' ? <FooterWithHints /> : undefined : undefined}
        onClose={handleClose}
        width='100vw'
        destroyOnClose={true}>
        {props.children}
      </Drawer>
    </>
  );
}
