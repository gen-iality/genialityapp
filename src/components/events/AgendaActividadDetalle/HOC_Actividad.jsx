import React, { useContext } from 'react';
import { HelperContext } from '../../../Context/HelperContext';
import ImageComponentwithContext from './ImageComponent';
import RenderComponent from './RenderComponent';

const HCOActividad = () => {
  let { currentActivity } = useContext(HelperContext);
  return (
    <header>
      <div>
        <RenderComponent />

        {/* {currentActivity && currentActivity.secondvideo && <SecondVideoActivity />} */}

        {((currentActivity?.habilitar_ingreso == '' || currentActivity?.habilitar_ingreso == null) &&
          (currentActivity?.video == null || !currentActivity?.video)) ||
          (!currentActivity?.habilitar_ingreso && !currentActivity?.video && <ImageComponentwithContext />)}
      </div>
    </header>
  );
};

export default HCOActividad;
