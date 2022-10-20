import { useState } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { useEventContext } from '@context/eventContext';

export function EnableFacebookPixelByEVENT() {
  const [trackSingleCustom, setTrackSingleCustom] = useState(false);
  const cEventContext = useEventContext();
  const pixelId = cEventContext.value.facebookpixelid;

  const options = {
    autoConfig: true,
    debug: false,
  };
  const data = {
    NuevoIngreso: 'Nuevo ingreso al curso',
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
