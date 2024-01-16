import { Typography } from 'antd';
import {
	TLastUpdate,
	TLegalAnchor,
	TLegalContent,
	TLegalParagraphs,
	TLegalTitle,
	TVersion,
} from '../typings/interfaces';
import { convertFormat } from '@/helpers/utils';

// Aqui encontramos el contenido y titulo de cada sección de la vista
const termsSections = {
	SERVICE_ACCEPTANCE: {
		title: 'Aceptación de servicio',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Al usar o ingresar a cualquiera de nuestros servicios, reconoces que has leído y aceptado nuestra política de
					privacidad y aceptado nuestros Términos y condiciones, aplicables a todos los usuarios, y además estás
					aceptando cualquier reglamento de uso, política o proceso que EVIUS actualice durante el uso de la misma.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En caso de no estar de acuerdo, o no aceptas ninguno de estos términos, políticas, o reglas de uso, no podrás
					usar la plataforma, ni los servicios prestados por EVIUS.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Al aceptar, te comprometes a utilizar Evius de manera ética y legal. No podrás utilizar la plataforma para
					actividades ilegales o violatorias de derechos de terceros.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	SERVICE_DESCRIPTION: {
		title: 'Descripción del servicio',
		content: (
			<Typography.Paragraph>
				EVIUS ofrece una plataforma basada en la web, usada para la gestión y ejecución de eventos virtuales, físicos e
				híbridos en toda clase de actividades organizadas por personas naturales y/o jurídicas, permitiendo llevar una
				gran experiencia para los asistentes a sus eventos, a través de diversos servicios con los que cuenta la
				plataforma.
			</Typography.Paragraph>
		),
	},
	PLATFORM_USAGE: {
		Title: 'Uso de la plataforma',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					El acceso a EVIUS podrá ser realizado por cualquier dispositivo con acceso a internet, como computadores,
					móviles Android, iOS, tablets, y smart TV, que tengan incluido uso de navegadores web como Microsoft Edge,
					Firefox Mozilla, Google Chrome, Safari, Opera, Brave, entre otros, importante que el navegador con el cual
					accede debe estar actualizado.
				</Typography.Paragraph>
				<Typography.Paragraph>
					EVIUS ha ejecutado diversas pruebas con el fin de garantizar la disponibilidad de la plataforma y los
					servicios que ella presta a los usuarios. No obstante, podrá presentar momentos de interrupción por labores de
					mantenimiento, errores de hardware/software u otras causas de fuerza mayor. En estos casos, EVIUS informará a
					los organizadores de manera oportuna los mantenimientos o errores causados por terceros.
				</Typography.Paragraph>
				<Typography.Paragraph>
					De acuerdo con lo anterior, EVIUS se exime de toda responsabilidad por posibles daños y/o perjuicios causados
					por la falta de disponibilidad o de continuidad del funcionamiento de los servicios prestados.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	ATTENDEE_DATA_RECORD: {
		title: 'Registro de datos de asistentes',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Al utilizar nuestra plataforma para registrarse en eventos físicos, virtuales e híbridos, los asistentes
					pueden ser requeridos por la empresa organizadora del evento a proporcionar ciertos datos personales a través
					de formularios en línea. Estos datos pueden incluir, entre otros, información como nombre completo, dirección
					de correo electrónico, número de teléfono, afiliación a la empresa u organización, cargo, preferencias de
					contacto, y cualquier otra información relevante para la participación en el evento.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Al enviar esta información a través de los formularios proporcionados, los asistentes aceptan y consienten
					voluntariamente la recopilación, procesamiento y almacenamiento de sus datos personales por parte de nuestra
					plataforma y la empresa organizadora del evento. La empresa organizadora se compromete a utilizar estos datos
					exclusivamente con el propósito de gestionar la participación en el evento y cumplir con cualquier requisito
					legal aplicable.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Al aceptar estos términos y condiciones, los asistentes reconocen y aceptan la recopilación de datos
					personales de acuerdo con lo establecido anteriormente.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	PLATFORM_ENTRY: {
		title: 'Ingreso a la plataforma',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Para acceder a EVIUS, contamos con 3 tipos de acceso para usuarios y organizadores a saber:
				</Typography.Paragraph>
				<Typography.Paragraph>
					<Typography.Text strong>Evento público con Registro:</Typography.Text> En este tipo de acceso, los usuarios
					deberán registrarse previamente a la plataforma, y posteriormente, deberán inscribirse al evento. Este tipo de
					acceso permitirá a los asistentes acceder a todos los servicios de la plataforma. Desde una transmisión, hasta
					actividades de experiencia masiva (bingos, networking, juegos, entre otros) EVIUS solicitará a los asistentes
					los siguientes datos básicos:
					<ul>
						<li>Correo electrónico</li>
						<li>Contraseña</li>
						<li>Nombre</li>
					</ul>
					En caso necesario por la organización, se contará con un registro donde, a discreción del cliente, se podrá
					incluir otro tipo de información del asistente, como números de teléfono, país, ciudad, género, entre otros
					elementos.
				</Typography.Paragraph>
				<Typography.Paragraph>
					<Typography.Text strong>Evento público sin Registro:</Typography.Text> En este tipo de acceso, toda persona
					que tenga el enlace de la plataforma podrá ingresar sin el registro de datos. Contará con un chat para
					interacción durante la actividad. No obstante, para este tipo de eventos no podrán utilizar algunos servicios
					de la plataforma, como las actividades de experiencia masiva mencionadas anteriormente.
				</Typography.Paragraph>
				<Typography.Paragraph>
					<Typography.Text strong>Evento privado por invitación:</Typography.Text> Para este tipo de acceso, los
					organizadores deberán enviar a EVIUS una base de datos de los asistentes que ingresarán al evento, permitiendo
					usar todos los servicios que haya contratado con EVIUS. Personas externas a esta base de datos no podrán
					ingresar al evento.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Todos los asistentes deberán proporcionar información precisa durante el registro. Cada persona es responsable
					de mantener la confidencialidad de su cuenta y contraseña.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	ATTENDEE_LIMIT: {
		title: 'Límite de asistentes',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					El número máximo de asistentes permitido para cada evento se establecerá y comunicará claramente durante el
					proceso de organización. El cliente acuerda respetar este límite para garantizar la calidad y seguridad del
					evento en EVIUS.
				</Typography.Paragraph>
				<Typography.Paragraph>
					El cliente reconoce y acepta que la plataforma no permitirá la participación de un número de asistentes que
					exceda el límite acordado para el evento en cuestión.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En el caso de que cliente desee superar el límite de asistentes acordado, se requiere realizar una cotización
					adicional. El cliente debe ponerse en contacto con nuestro personal de ventas para discutir la posibilidad de
					aumentar el número de participantes.
				</Typography.Paragraph>
				<Typography.Paragraph>
					El aumento del límite de asistentes solo se considerará efectivo después de la aprobación explícita por parte
					de ambas partes y la implementación por parte de la plataforma. Este proceso garantiza que la plataforma pueda
					manejar de manera efectiva un número mayor de participantes y que se brinden los recursos necesarios para
					garantizar una experiencia exitosa del evento.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	ATTENDEE_PAYMENT: {
		title: 'Cobro de asistentes',
		content: (
			<Typography.Paragraph>
				El método de facturación con respecto al número de asistentes se fundamenta en una cantidad preestablecida
				acordada con el cliente, por ejemplo, 1000 asistentes. Se efectuará la facturación en función de este número,
				sin considerar la cantidad real de asistentes o registros al evento, siempre y cuando no exceda la cantidad
				pactada entre ambas partes. En caso de superar dicho límite acordado, se aplicará un cargo adicional, conforme
				se detalla en el punto anterior. Este enfoque proporciona claridad en la estructura de tarifas y asegura que el
				cliente abone únicamente por la capacidad acordada, ofreciendo la posibilidad de adaptarse a cambios en la
				asistencia dentro de los límites establecidos.
			</Typography.Paragraph>
		),
	},
	PLATFORM_USAGE_VALIDITY_DURATION: {
		title: 'Vigencia y duración de uso de plataforma',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					El uso de la plataforma y/o servicios entran en rigor en el momento que se firme el contrato de servicios de
					la plataforma, permitiendo realizar cualquier personalización permitida por la misma, inserción de contenidos
					y otros elementos para la ejecución del evento.
				</Typography.Paragraph>
				<Typography.Paragraph>
					El organizador contará con personal calificado para gestionar y ejecutar los eventos o actividades que
					contrate durante la vigencia del evento, garantizando así el excelente uso de la plataforma.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Tras la finalización de un evento, la plataforma contará con disponibilidad de cuarenta y ocho (48) horas para
					que los organizadores y/o asistentes puedan revisar de nuevo la landing o ver las actividades realizadas
					durante el evento. Terminado ese tiempo, EVIUS se encargará de bloquear cualquier acceso y/o registro de
					nuevos usuarios o visualizaciones de usuarios registrados.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Una vez se bloquee, se informará al cliente sobre la eliminación del evento, se le entregará por medio digital
					un enlace para que descargue el video del evento (en caso de contar con transmisión), con vigencia de 2 días,
					una vez vencido el plazo de descarga, se procederá con la eliminación del evento. Es deber del organizador
					asegurarse de visualizar y descargar tanto los videos, como contenido relevante dentro de este plazo.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En caso de que el organizador adquiera un servicio de VOD (Videos on Demand), la plataforma mantendrá la
					landing y videos durante el tiempo que el organizador contrate con EVIUS o en su defecto por 30 días.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Cualquier extensión otorgada estará sujeta a la aprobación y términos adicionales acordados entre el
					organizador y Evius
				</Typography.Paragraph>
				<Typography.Paragraph>
					La vigencia del evento se basará en los siguientes tipos de eventos a contratar:
					<ul>
						<li>Evento informativo: Acceso al evento por 48 horas una vez haya culminado</li>
						<li>Evento informativo y transmisión: Acceso al evento por 48 horas una vez haya culminado</li>
						<li>Evento informativo, transmisión y VOD: Acceso al evento por 30 días una vez haya culminado</li>
					</ul>
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	FEES_AND_PAYMENTS: {
		title: 'Fees y pagos',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Los servicios de la plataforma estarán disponibles bajo los acuerdos de contrato entre Moción S.A.S. y el
					Organizador.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Durante la vigencia del contrato, el organizador deberá aportar todos los elementos necesarios para que la
					plataforma esté acorde al contrato firmado.
				</Typography.Paragraph>
				<Typography.Paragraph>
					El organizador no podrá modificar los servicios contratados, salvo que haya realizado un pago adicional en
					caso de ser necesario.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Los pagos del servicio contratado deberán realizarse de acuerdo a la negociación realizada con el área
					comercial de Mocion S.A.S, comprometiéndose a cumplir con las mismas, de acuerdo a los plazos establecidos.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En caso de cualquier retraso en el pago de los servicios prestados, EVIUS tendrá el derecho de suspender el
					acceso a los servicios contratados hasta que se realice el pago pendiente.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	INTELLECTUAL_PROPERTY: {
		title: 'Propiedad intelectual',
		content: (
			<Typography.Paragraph>
				Todos los derechos de propiedad intelectual relacionados con la plataforma, su contenido y cualquier material
				asociado, incluyendo pero no limitado a software, diseño, texto, gráficos, logotipos y demás, son propiedad
				exclusiva de la empresa operadora de la plataforma o de los licenciantes correspondientes. Los usuarios y
				clientes reconocen y aceptan que no adquieren ningún derecho de propiedad sobre la plataforma, sus funciones o
				contenido.
			</Typography.Paragraph>
		),
	},
	PLATFORM_UPDATES_MAINTENANCE: {
		title: 'Actualizaciones y mantenimiento de la plataforma',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Implementaremos regularmente actualizaciones que pueden incluir nuevas características, mejoras de rendimiento
					y correcciones de errores. Estas actualizaciones buscan mantener la plataforma a la vanguardia y ofrecer una
					experiencia óptima.
				</Typography.Paragraph>
				<Typography.Paragraph>
					No se proporcionará mantenimiento a versiones antiguas de la plataforma. Los clientes son responsables de
					adaptarse a las versiones más recientes para acceder a las últimas características y mejoras de seguridad. La
					falta de actualización puede afectar la funcionalidad y seguridad de la plataforma.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Informaremos a los usuarios sobre nuevas actualizaciones y proporcionaremos detalles sobre los cambios
					realizados. Es responsabilidad del usuario revisar y comprender estas actualizaciones.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	TICKET_COLLECTION: {
		title: 'Recaudación de boletería',
		content: (
			<Typography.Paragraph>
				En el caso de contratar nuestro módulo de boletería, el recaudo de fondos para el cliente se llevará a cabo
				mediante un proceso de corte quincenal. Esto significa que el monto acumulado por la venta de boletos se
				liquidará y se transferirá al cliente cada 15 días, a partir de la fecha de la apertura de venta los tiquetes.
			</Typography.Paragraph>
		),
	},
	EVENT_CANCELLATION: {
		title: 'Cancelación de evento',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					En el caso de que el cliente desee solicitar la cancelación de un evento previamente programado, se debe
					notificar a nuestra plataforma con la debida antelación especificada en los términos del contrato.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Es importante destacar que, a pesar de la cancelación del evento, no se realizará ninguna devolución del
					dinero consignado por el cliente. Los fondos aportados se considerarán no reembolsables y se destinarán a
					cubrir los costos y compromisos incurridos por la plataforma en la preparación y organización del evento. La
					cancelación no exime al cliente de cumplir con otros términos y condiciones estipulados en el contrato, y
					cualquier obligación financiera acordada previamente permanecerá vigente.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	EVENT_REFUND: {
		title: 'Reembolso de un evento',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					En situaciones excepcionales y fuera del control de ambas partes, como desastres naturales imprevistos que
					impacten significativamente en la realización de un evento, se contempla la posibilidad de reembolso. Si un
					evento se ve afectado y debe ser cancelado debido a circunstancias de fuerza mayor, tales como desastres
					naturales, incendios, inundaciones u otros eventos catastróficos, el cliente podrá solicitar un reembolso del
					monto abonado.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Adicionalmente, en el caso poco probable de que la plataforma experimente una falta de disponibilidad que
					impida la realización del evento, también se considerará elegible para un reembolso total o parcial.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Es necesario que el cliente informe de inmediato a nuestra plataforma sobre la situación y presente evidencia
					documentada de la relación directa entre el desastre natural o la falta de disponibilidad de la plataforma y
					la cancelación del evento. Nuestra plataforma evaluará cada caso de manera individual y determinará, a su
					discreción, la elegibilidad para el reembolso total o parcial.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Este proceso de reembolso está diseñado para abordar circunstancias extraordinarias e imprevisibles, buscando
					ofrecer una solución justa y equitativa en casos de cancelación debida a desastres naturales o a la falta de
					disponibilidad de la plataforma. La decisión final sobre el reembolso quedará sujeta a la evaluación detallada
					de cada situación específica.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	ILLEGAL_CONTENT_PROHIBITION: {
		title: 'Prohibición de Contenido Ilegal y Consecuencias',
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Se prohíbe estrictamente la carga, transmisión o promoción de contenido ilegal en cualquier forma, incluyendo,
					pero no limitado a, material difamatorio, obsceno, pornográfico, fraudulento, amenazante o que viole los
					derechos de propiedad intelectual de terceros. En el caso de que se detecte la presencia de dicho contenido en
					la plataforma, la empresa organizadora del evento será notificada de inmediato.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En conformidad con esta política, la plataforma se reserva el derecho de cancelar el evento sin previo aviso y
					sin la obligación de realizar devolución alguna de los pagos realizados. Además, se cooperará plenamente con
					las autoridades competentes en la investigación de actividades ilegales y se tomarán las medidas legales
					apropiadas.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Los ejemplos mencionados anteriormente son indicativos y no exhaustivos. Cualquier contenido que viole las
					leyes locales, nacionales o internacionales está sujeto a la misma prohibición y consecuencias. Se insta a los
					usuarios a revisar y respetar los términos y condiciones para garantizar una experiencia segura y legal en la
					plataforma.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	TERMS_CONDITIONS_MODIFICATIONS: {
		title: 'Modificaciones de los términos y condiciones',
		content: (
			<Typography.Paragraph>
				EVIUS podrá modificar el uso de los servicios de la plataforma en cualquier momento. En estos casos,
				notificaremos por correo electrónico de los organizadores recurrentes, o a través de la página web, todos los
				cambios derivados de las actualizaciones de la plataforma.
			</Typography.Paragraph>
		),
	},
};

export const termsLastUpdate: TLastUpdate = '29/12/2023';
export const termsVersion: TVersion = '2.0.0';

// Indica aqui el titulo de la vista
export const termsTitle: TLegalTitle = 'TÉRMINOS Y CONDICIONES PLATAFORMA EVIUS';

export const termsParagraph: TLegalParagraphs =
	'Gracias por elegir a EVIUS como la plataforma de eventos virtuales, físicos e híbridos. Como empresa queremos que tus eventos tengan la mejor experiencia y calidad que te mereces, por eso te invitamos a leer estos términos y condiciones de uso de nuestra plataforma con el fin de ofrecerte lo mejor para tus eventos.';

// Con esto creamos los ID para conectarlos con el emnu de navegación
export const termsAnchor: TLegalAnchor = [
	{ title: termsSections.SERVICE_ACCEPTANCE.title, anchor: convertFormat(termsSections.SERVICE_ACCEPTANCE.title) },
	{ title: termsSections.SERVICE_DESCRIPTION.title, anchor: convertFormat(termsSections.SERVICE_DESCRIPTION.title) },
	{ title: termsSections.PLATFORM_USAGE.Title, anchor: convertFormat(termsSections.PLATFORM_USAGE.Title) },
	{ title: termsSections.ATTENDEE_DATA_RECORD.title, anchor: convertFormat(termsSections.ATTENDEE_DATA_RECORD.title) },
	{ title: termsSections.PLATFORM_ENTRY.title, anchor: convertFormat(termsSections.PLATFORM_ENTRY.title) },
	{ title: termsSections.ATTENDEE_LIMIT.title, anchor: convertFormat(termsSections.ATTENDEE_LIMIT.title) },
	{ title: termsSections.ATTENDEE_PAYMENT.title, anchor: convertFormat(termsSections.ATTENDEE_PAYMENT.title) },
	{
		title: termsSections.PLATFORM_USAGE_VALIDITY_DURATION.title,
		anchor: convertFormat(termsSections.PLATFORM_USAGE_VALIDITY_DURATION.title),
	},
	{ title: termsSections.FEES_AND_PAYMENTS.title, anchor: convertFormat(termsSections.FEES_AND_PAYMENTS.title) },
	{
		title: termsSections.INTELLECTUAL_PROPERTY.title,
		anchor: convertFormat(termsSections.INTELLECTUAL_PROPERTY.title),
	},
	{
		title: termsSections.PLATFORM_UPDATES_MAINTENANCE.title,
		anchor: convertFormat(termsSections.PLATFORM_UPDATES_MAINTENANCE.title),
	},
	{ title: termsSections.TICKET_COLLECTION.title, anchor: convertFormat(termsSections.TICKET_COLLECTION.title) },
	{ title: termsSections.EVENT_CANCELLATION.title, anchor: convertFormat(termsSections.EVENT_CANCELLATION.title) },
	{ title: termsSections.EVENT_REFUND.title, anchor: convertFormat(termsSections.EVENT_REFUND.title) },
	{
		title: termsSections.ILLEGAL_CONTENT_PROHIBITION.title,
		anchor: convertFormat(termsSections.ILLEGAL_CONTENT_PROHIBITION.title),
	},
	{
		title: termsSections.TERMS_CONDITIONS_MODIFICATIONS.title,
		anchor: convertFormat(termsSections.TERMS_CONDITIONS_MODIFICATIONS.title),
	},
];
// Estructura final de la vista
export const termsContent: TLegalContent = [
	{
		title: termsSections.SERVICE_ACCEPTANCE.title,
		anchor: termsAnchor[0].anchor,
		content: termsSections.SERVICE_ACCEPTANCE.content,
	},
	{
		title: termsSections.SERVICE_DESCRIPTION.title,
		anchor: termsAnchor[1].anchor,
		content: termsSections.SERVICE_DESCRIPTION.content,
	},
	{
		title: termsSections.PLATFORM_USAGE.Title,
		anchor: termsAnchor[2].anchor,
		content: termsSections.PLATFORM_USAGE.content,
	},
	{
		title: termsSections.ATTENDEE_DATA_RECORD.title,
		anchor: termsAnchor[3].anchor,
		content: termsSections.ATTENDEE_DATA_RECORD.content,
	},
	{
		title: termsSections.PLATFORM_ENTRY.title,
		anchor: termsAnchor[4].anchor,
		content: termsSections.PLATFORM_ENTRY.content,
	},
	{
		title: termsSections.ATTENDEE_LIMIT.title,
		anchor: termsAnchor[5].anchor,
		content: termsSections.ATTENDEE_LIMIT.content,
	},
	{
		title: termsSections.ATTENDEE_PAYMENT.title,
		anchor: termsAnchor[6].anchor,
		content: termsSections.ATTENDEE_PAYMENT.content,
	},
	{
		title: termsSections.PLATFORM_USAGE_VALIDITY_DURATION.title,
		anchor: termsAnchor[7].anchor,
		content: termsSections.PLATFORM_USAGE_VALIDITY_DURATION.content,
	},
	{
		title: termsSections.FEES_AND_PAYMENTS.title,
		anchor: termsAnchor[8].anchor,
		content: termsSections.FEES_AND_PAYMENTS.content,
	},
	{
		title: termsSections.INTELLECTUAL_PROPERTY.title,
		anchor: termsAnchor[9].anchor,
		content: termsSections.INTELLECTUAL_PROPERTY.content,
	},
	{
		title: termsSections.PLATFORM_UPDATES_MAINTENANCE.title,
		anchor: termsAnchor[10].anchor,
		content: termsSections.PLATFORM_UPDATES_MAINTENANCE.content,
	},
	{
		title: termsSections.TICKET_COLLECTION.title,
		anchor: termsAnchor[11].anchor,
		content: termsSections.TICKET_COLLECTION.content,
	},
	{
		title: termsSections.EVENT_CANCELLATION.title,
		anchor: termsAnchor[12].anchor,
		content: termsSections.EVENT_CANCELLATION.content,
	},
	{
		title: termsSections.EVENT_REFUND.title,
		anchor: termsAnchor[13].anchor,
		content: termsSections.EVENT_REFUND.content,
	},
	{
		title: termsSections.ILLEGAL_CONTENT_PROHIBITION.title,
		anchor: termsAnchor[14].anchor,
		content: termsSections.ILLEGAL_CONTENT_PROHIBITION.content,
	},
	{
		title: termsSections.TERMS_CONDITIONS_MODIFICATIONS.title,
		anchor: termsAnchor[15].anchor,
		content: termsSections.TERMS_CONDITIONS_MODIFICATIONS.content,
	},
];
