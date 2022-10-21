import { ChangeEvent } from 'react';

export type UrlProcessorType = (e: ChangeEvent<HTMLInputElement>) => string;

const urlProcessorSet: { [key: string]: UrlProcessorType } = {
  // NOTE: hook-able
  youTube: (e: ChangeEvent<HTMLInputElement>) => {
    // obtenemos el ID del youtube
    const id = e.target.value.match(
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    );
    // reternamos el ID si existe, si no retornamos el valor del input
    return id ? id[1] : e.target.value;
  },
  vimeo: (e: ChangeEvent<HTMLInputElement>) => {
    const idVimeo = e.target.value.match(/(videos|video|channels|event|\.com)\/([\d]+)/);
    return idVimeo ? idVimeo[2] : e.target.value;
  },
  url: (e: ChangeEvent<HTMLInputElement>) => {
    return e.target.value;
  },
};

export default urlProcessorSet;
