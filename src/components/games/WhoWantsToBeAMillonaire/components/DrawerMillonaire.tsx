import { Row, Button, Drawer } from 'antd';
import MenuGame from './MenuGame';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
import WildCards from './WildCards';
export default function DrawerMillonaire() {
  const { isVisible, onChangeVisibilityDrawer, millonaire, startGame } = useMillonaireLanding();

  return (
    <>
      <Row align='middle' justify='center' style={{ padding: '10px' }}>
        <Button size='large' type='primary' onClick={onChangeVisibilityDrawer}>
          ¡Jugar Millonario!
        </Button>
      </Row>
      <Drawer title={millonaire.name} footer={startGame && <WildCards />} visible={isVisible}>
        <MenuGame />
      </Drawer>
    </>
  );
}
