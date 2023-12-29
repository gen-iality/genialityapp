import { Typography } from 'antd';
import { TLegalAnchor, TLegalContent, TLegalParagraphs, TLegalTitle } from '../typings/interfaces';
import { convertFormat } from '@/helpers/utils';

const termsSections = {
	SERVICE_ACCEPTANCE: 'Aceptación de servicio',
	SERVICE_DESCRIPTION: 'Descripción del servicio',
	PLATFORM_USAGE: 'Uso de la plataforma',
	ATTENDEE_DATA_RECORD: 'Registro de datos de asistentes',
	PLATFORM_ENTRY: 'Ingreso a la plataforma',
	ATTENDEE_LIMIT: 'Límite de asistentes',
	PLATFORM_USAGE_VALIDITY_DURATION: 'Vigencia y duración de uso de plataforma',
	FEES_AND_PAYMENTS: 'Fees y pagos',
	INTELLECTUAL_PROPERTY: 'Propiedad intelectual',
	PLATFORM_UPDATES_MAINTENANCE: 'Actualizaciones y mantenimiento de la plataforma',
	TERMS_CONDITIONS_MODIFICATIONS: 'Modificaciones de los términos y condiciones',
};

export const termsTitle: TLegalTitle = 'TÉRMINOS Y CONDICIONES PLATAFORMA EVIUS';
export const termsParagraph: TLegalParagraphs =
	'Gracias por elegir a EVIUS como la plataforma de eventos virtuales, físicos e híbridos. Como empresa queremos que tus eventos tengan la mejor experiencia y calidad que te mereces, por eso te invitamos a leer estos términos y condiciones de uso de nuestra plataforma con el fin de ofrecerte lo mejor para tus eventos.';
export const termsAnchor: TLegalAnchor = [
	{ title: termsSections.SERVICE_ACCEPTANCE, anchor: convertFormat(termsSections.SERVICE_ACCEPTANCE) },
  { title: termsSections.SERVICE_DESCRIPTION, anchor: convertFormat(termsSections.SERVICE_DESCRIPTION) },
  { title: termsSections.PLATFORM_USAGE, anchor: convertFormat(termsSections.PLATFORM_USAGE) },
  { title: termsSections.ATTENDEE_DATA_RECORD, anchor: convertFormat(termsSections.ATTENDEE_DATA_RECORD) },
  { title: termsSections.PLATFORM_ENTRY, anchor: convertFormat(termsSections.PLATFORM_ENTRY) },
  { title: termsSections.ATTENDEE_LIMIT, anchor: convertFormat(termsSections.ATTENDEE_LIMIT) },
  { title: termsSections.PLATFORM_USAGE_VALIDITY_DURATION, anchor: convertFormat(termsSections.PLATFORM_USAGE_VALIDITY_DURATION) },
  { title: termsSections.FEES_AND_PAYMENTS, anchor: convertFormat(termsSections.FEES_AND_PAYMENTS) },
  { title: termsSections.INTELLECTUAL_PROPERTY, anchor: convertFormat(termsSections.INTELLECTUAL_PROPERTY) },
  { title: termsSections.PLATFORM_UPDATES_MAINTENANCE, anchor: convertFormat(termsSections.PLATFORM_UPDATES_MAINTENANCE) },
  { title: termsSections.TERMS_CONDITIONS_MODIFICATIONS, anchor: convertFormat(termsSections.TERMS_CONDITIONS_MODIFICATIONS) },
];

export const termsContent: TLegalContent = [
	{
		title: <>{termsAnchor[0].title}</>,
		anchor: termsAnchor[0].anchor,
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
	{
		title: <>{termsAnchor[1].title}</>,
		anchor: termsAnchor[1].anchor,
		content: (
			<Typography.Paragraph>
				EVIUS ofrece una plataforma basada en la web, usada para la gestión y ejecución de eventos virtuales, físicos e
				híbridos en toda clase de actividades organizadas por personas naturales y/o jurídicas, permitiendo llevar una
				gran experiencia para los asistentes a sus eventos, a través de diversos servicios con los que cuenta la
				plataforma.
			</Typography.Paragraph>
		),
	},
	{
		title: <>{termsAnchor[2].title}</>,
		anchor: termsAnchor[2].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					El acceso a EVIUS podrá ser realizado por cualquier dispositivo con acceso a internet, como computadores,
					móviles Android, iOS, tablets, y smart TV, que tengan incluido uso de navegadores web como Microsoft Edge,
					Firefox Mozilla, Google Chrome, Safari, Opera, Brave, entre otros.
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
	{
		title: <>{termsAnchor[3].title}</>,
		anchor: termsAnchor[3].anchor,
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
	{
		title: <>{termsAnchor[4].title}</>,
		anchor: termsAnchor[4].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Para acceder a EVIUS, contamos con 4 tipos de acceso para usuarios y organizadores a saber:
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
	{
		title: <>{termsAnchor[5].title}</>,
		anchor: termsAnchor[5].anchor,
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
	{
		title: <>{termsAnchor[6].title}</>,
		anchor: termsAnchor[6].anchor,
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
					Tras la finalización de un evento, la plataforma contará con disponibilidad de ocho (8) días para que los
					organizadores y/o póstumos asistentes puedan revisar de nuevo la landing o ver las actividades realizadas
					durante el evento. Terminado ese tiempo, EVIUS se encargará de bloquear cualquier acceso y/o registro de
					nuevos usuarios o visualizaciones de usuarios registrados.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Una vez se bloquee, se informará al cliente sobre la eliminación del evento, se le entregará por medio digital
					un enlace para que descargue el video del evento (en caso de contar con transmisión), con vigencia de 3 días,
					una vez vencido el plazo de descarga, se procederá con la eliminación del evento. Es deber del organizador
					asegurarse de visualizar y descargar tanto los videos, como contenido relevante dentro de este plazo.
				</Typography.Paragraph>
				<Typography.Paragraph>
					En caso de que el organizador adquiera un servicio de VOD (Videos on Demand), la plataforma mantendrá la
					landing y videos durante el tiempo que el organizador contrate con EVIUS.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Cualquier extensión otorgada estará sujeta a la aprobación y términos adicionales acordados entre el
					organizador y Evius.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{termsAnchor[7].title}</>,
		anchor: termsAnchor[7].anchor,
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
	{
		title: <>{termsAnchor[8].title}</>,
		anchor: termsAnchor[8].anchor,
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
	{
		title: <>{termsAnchor[9].title}</>,
		anchor: termsAnchor[9].anchor,
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
	{
		title: <>{termsAnchor[10].title}</>,
		anchor: termsAnchor[10].anchor,
		content: (
			<Typography.Paragraph>
				EVIUS podrá modificar el uso de los servicios de la plataforma en cualquier momento. En estos casos,
				notificaremos por correo electrónico de los organizadores recurrentes, o a través de la página web, todos los
				cambios derivados de las actualizaciones de la plataforma.
			</Typography.Paragraph>
		),
	},
];
