import { useState } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { UseEventContext } from '../../../../context/eventContext';

export function EnableFacebookPixelByEVENT() {
  const [trackSingleCustom, setTrackSingleCustom] = useState(false);
  let cEventContext = UseEventContext();
  let pixelId = cEventContext.value.facebookpixelid;

  const options = {
    autoConfig: true,
    debug: false,
  };
  const data = {
    NuevoIngreso: 'Nuevo ingreso al evento',
  };

  if (!pixelId) return null;

  ReactPixel.init(pixelId, options);
  if (!trackSingleCustom) {
    ReactPixel.trackSingleCustom(pixelId, `Evento${cEventContext.value._id}`, data);
    setTrackSingleCustom(true);
  }

  ReactPixel.pageView(); // For tracking page view

  return null;
}
