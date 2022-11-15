import { Button } from 'antd';
import useSharePhotoInLanding from '../hooks/useSharePhotoInLanding';

export default function GoBack() {
  const { goTo, location } = useSharePhotoInLanding();

  const handleGoBack = () => {
    switch (location.activeView) {
      case 'introduction':
        return;
      case 'chooseAction':
        return goTo('introduction');
      case 'createPost':
        return goTo('chooseAction');
      case 'importPhoto':
        return goTo('chooseAction');
      case 'takePhoto':
        return goTo('chooseAction');
      case 'galery':
        return goTo('introduction');
      default:
        return goTo('introduction');
    }
  };
  const handleTextGoBack = () => {
    switch (location.activeView) {
      case 'introduction':
        return;
      case 'chooseAction':
      case 'galery':
        return 'Volver al inicio';
      case 'createPost':
      case 'importPhoto':
      case 'takePhoto':
        return 'Volver a escoger';
      default:
        return 'Atras';
    }
  };

  return (
    <Button onClick={handleGoBack} style={{ display: location.activeView === 'introduction' ? 'none' : 'block' }}>
      {handleTextGoBack()}
    </Button>
  );
}
