export const addFormatCero = (valor) => {
  if (valor < 10) {
    return '0' + valor;
  } else {
    return '' + valor;
  }
};
export const milisegundosTohour = (milisegundos) => {
  const hours = parseInt(milisegundos / 1000 / 60 / 60);
  milisegundos -= hours * 60 * 60 * 1000;
  const minutos = parseInt(milisegundos / 1000 / 60);
  milisegundos -= minutos * 60 * 1000;
  const segundos = milisegundos / 1000;
  /* console.log('SEGUNDOS==>', segundos, hours, minutos); */
  if (hours > 0 && minutos > 0) {
    return `${addFormatCero(hours)}:${addFormatCero(minutos)}:${addFormatCero(segundos.toFixed(0))}`;
  } else if (hours === 0 && minutos > 0) {
    return `${addFormatCero(minutos)}:${addFormatCero(segundos.toFixed(0))}`;
  } else {
    return `${addFormatCero(segundos.toFixed(0))} s`;
  }
  // return `${addFormatCero(hours)}:${addFormatCero(minutos)}:${addFormatCero(segundos.toFixed(0))}`;
};
