const rules = {
  youTube: [
    {
      required: true,
      message: 'Por favor ingrese el ID o la URL de YouTube.',
    },
    ({}: any) => ({
      validator(_: any, value: string) {
        // Aquí validamos si el ID es valido o si la url es validad
        // si cualquiera de los dos es valido entonces retornamos `true`,
        // si no retornamos el error.
        const regexpURL = new RegExp(
          /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        );
        const regId = new RegExp(/^((\w|-){11})(?:\S+)?$/);
        if (regexpURL.test(value) || (regId.test(value) && value.length === 11)) {
          return Promise.resolve();
        }
        return Promise.reject('Por favor ingrese un ID o URL valido de Youtube.');
      },
    }),
  ],
  vimeo: [
    {
      required: true,
      message: 'Por favor ingrese un ID de Vimeo.',
    },
    { type: 'string', min: 8, max: 10, message: 'El ID debe tener entre 8 a 10 dígitos.' },
  ],
  url: [
    { required: true, message: 'Por favor ingrese la URL del video.' },
    { type: 'url', message: 'Por favor ingrese una URL valida.' },
    { type: 'string', min: 6, message: 'La URL debe ser mayor a 6 caracteres.' },
  ],
};

export default rules;
