import React, {Component} from 'react';

class Faqs extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="columns is-mobile">
                <div className="column is-half is-offset-one-quarter">
                    <h1 className="title is-spaced">PREGUNTAS FRECUENTES SOBRE PAGOS ELECTRÓNICOS</h1>
                    <h2 className="subtitle has-text-weight-semibold">1. ¿Qué es PlacetoPay?</h2>
                    <p><span className="has-text-weight-semibold">PlacetoPay</span> es la plataforma de pagos electrónicos que usa <span className="has-text-weight-semibold">MOCION S.A.S.</span> para procesar en línea las transacciones generadas en la tienda virtual con las formas de pago habilitadas para tal fin.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">2. ¿Cómo puedo pagar?</h2>
                    <p>En la tienda virtual de <span className="has-text-weight-semibold">MOCION S.A.S.</span>usted podrá realizar su pago con los medios habilitados para tal fin. Usted, de acuerdo a las opciones de pago escogidas por el comercio, podrá pagar a través de PSE (débitos desde cuentas de ahorros y corrientes en Colombia), tarjetas de crédito Visa, MasterCard, American Express, Credencial y Diners.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">3. ¿Es seguro ingresar mis datos bancarios en este sitio web?</h2>
                    <p>Para proteger tus datos <span className="has-text-weight-semibold">MOCION S.A.S.</span>delega en <span className="has-text-weight-semibold">PlacetoPay</span> la captura de la información sensible. Nuestra plataforma de pagos cumple con los más altos estándares exigidos por la norma internacional PCI DSS de seguridad en transacciones con tarjeta de crédito. Además tiene certificado de seguridad SSL expedido por GeoTrust una compañía Verisign, el cual garantiza comunicaciones seguras mediante la encriptación de todos los datos hacia y desde el sitio; de esta manera te podrás sentir seguro a la hora de ingresar la información de su tarjeta.
                        Durante el proceso de pago, en el navegador se muestra el nombre de la organización autenticada, la autoridad que lo certifica y la barra de dirección cambia a color verde. Estas características son visibles de inmediato y dan garantía y confianza para completar la transacción en <span className="has-text-weight-semibold">PlacetoPay</span>.</p>
                    <p><span className="has-text-weight-semibold">PlacetoPay</span> también cuenta con el monitoreo constante de McAfee Secure y la firma de mensajes electrónicos con Certicámara.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">4. ¿Puedo realizar el pago cualquier día y a cualquier hora?</h2>
                    <p>Sí, en <span className="has-text-weight-semibold">MOCION S.A.S.</span>podrás realizar tus compras en línea los 7 días de la semana, las 24 horas del día a sólo un clic de distancia.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">5. ¿Puedo cambiar la forma de pago?</h2>
                    <p>Si aún no has finalizado tu pago, podrás volver al paso inicial y elegir la forma de pago que prefieras. Una vez finalizada la compra no es posible cambiar la forma de pago.</p>
                    <p className="has-text-weight-semibold is-italic">ESTABLECIMIENTO DE COMERCIO: el punto anterior aplica a la forma de pago, pero deberán mencionar las políticas de devolución que tenga la tienda para dar cumplimiento al artículo 51 de la Ley del Estatuto del Consumidor.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">6. ¿Pagar electrónicamente tiene algún valor para mí como comprador?</h2>
                    <p>No, los pagos electrónicos realizados a través de <span className="has-text-weight-semibold">PlacetoPay</span> no generan costos adicionales para el comprador.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">7. ¿Qué debo hacer si mi transacción no concluyó?</h2>
                    <p>En primera instancia, revisar si llegó un email de confirmación de la transacción a la cuenta de correo electrónico inscrita en el momento de realizar el pago, en caso de no haberlo recibido, deberás contactar a <span className="has-text-weight-semibold">CATALINA RODRIGUEZ</span> para confirmar el estado de la transacción.</p>
                    <br/>
                    <h2 className="subtitle has-text-weight-semibold">8. ¿Qué debo hacer si no recibí el comprobante de pago?</h2>
                    <p>Por cada transacción aprobada a través de <span className="has-text-weight-semibold">PlacetoPay</span>, recibirás un comprobante del pago con la referencia de compra en la dirección de correo electrónico que indicaste al momento de pagar.</p>
                    <p>Si no lo recibes, podrás contactar a <span className="has-text-weight-semibold">CATALINA RODRIGUEZ</span> o a la línea <a href={'tel:5451988'} className="has-text-weight-semibold">545 19 88</a> o al correo electrónico <a href={'mailto:pagos@mocionsoft.com'} className="has-text-weight-semibold">pagos@mocionsoft.com</a>, para solicitar el reenvío del comprobante a la misma dirección de correo electrónico registrada al momento de pagar.</p>
                </div>
            </div>
        );
    }
}

export default Faqs;