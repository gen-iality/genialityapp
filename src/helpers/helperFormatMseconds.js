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
  console.log('SEGUNDOS==>', segundos, hours, minutos);
  return `${addFormatCero(hours)}:${addFormatCero(minutos)}:${addFormatCero(segundos.toFixed(1))}`;
};
