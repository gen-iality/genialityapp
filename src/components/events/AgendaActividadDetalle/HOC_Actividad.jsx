import { useHelper } from '../../../context/helperContext/hooks/useHelper';
import ImageComponentwithContext from './ImageComponent';
import RenderComponent from './RenderComponent';

const HCOActividad = () => {
  let { currentActivity } = useHelper();
  const imageVisible = () => {
    if (
      ((currentActivity?.habilitar_ingreso == '' || currentActivity?.habilitar_ingreso == null) &&
        (currentActivity?.video == null || !currentActivity?.video)) ||
      (!currentActivity?.habilitar_ingreso && !currentActivity?.video)
    ) {
      return true;
    }
    return false;
  };
  return (
    <header>
      <div>
        <RenderComponent />

        {/* {currentActivity && currentActivity.secondvideo && <SecondVideoActivity />} */}

        {/* {imageVisible() && <ImageComponentwithContext />} */}
      </div>
    </header>
  );
};

export default HCOActividad;
