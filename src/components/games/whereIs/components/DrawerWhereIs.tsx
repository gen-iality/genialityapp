import { Button, Drawer, Grid, Typography } from 'antd';
import { ReactNode, useState } from 'react';
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
      <Button size='large' type='primary' onClick={handleOpen}>
        ¿Y dónde se encuentra?
      </Button>
      <Drawer
        title={<Timer />}
        visible={open}
        bodyStyle={{
          padding: location.activeView === 'game' ? '0px' : screens.xs ? '5px' : '24px',
        }}
        headerStyle={{
          padding: 12,
        }}
        extra={<Lifes />}
        footer={location.activeView === 'game' ? <FooterWithHints /> : undefined}
        onClose={handleClose}
        width='100vw'
        destroyOnClose={true}>
        {props.children}
      </Drawer>
    </>
  );
}
