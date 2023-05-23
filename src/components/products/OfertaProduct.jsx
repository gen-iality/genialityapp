import { useState } from 'react';

function OfertaProduct(props) {
  const [oferta, setOferta] = useState('');

  const enviarOferta = async () => {
    // Validar el valor de oferta antes de enviarlo

    if (oferta > 0) {
      // Realizar la lógica necesaria para enviar el precio al servidor
      // Puedes utilizar una función de API o realizar una solicitud HTTP aquí

      try {
        // Ejemplo de envío del precio utilizando una función de API
        await EventsApi.enviarOferta(props.eventId, props.product.id, oferta);

        // Actualizar el estado o realizar otras acciones después de enviar el precio
        // ...

        // Actualizar el componente padre si es necesario
        props.updateValues(true);
      } catch (error) {
        console.log('Error al enviar la oferta:', error);
        // Manejar el error según sea necesario
      }
    } else {
      // Manejar el caso en que el precio ingresado no sea válido
    }
  };

  // Renderizar el componente de oferta con el campo de entrada y el botón de envío
  // ...

  // Agregar un manejador de eventos para el botón de envío de la oferta
  // Aquí se llama a la función enviarOferta cuando el usuario hace clic en el botón
  // ...

  return (
    // Renderizar el componente de oferta con el campo de entrada y el botón de envío
    <></>
  );
}

export default OfertaProduct;
