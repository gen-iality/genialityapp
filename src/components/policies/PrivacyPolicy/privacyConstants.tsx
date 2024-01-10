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

const privacySections = {
	INFO_COLLECTION: '¿Qué tipo de información recopilamos?',
	PERSONAL_INFO_USE: '¿Cómo utilizamos tu información personal?',
	INFO_SHARING: '¿Con quién compartimos tu información personal?',
	RIGHTS_HOLDER: '¿Cuáles son tus derechos como titular de esta información?',
	DATA_AUTHORIZATION_DURATION: 'Vigencia de la Autorización de tratamiento de datos personales',
	PRIVACY_NOTICE_CHANGES: 'Aviso por cambios en Aviso de Privacidad',
	PERSONAL_DATA_AUTHORIZATION: 'Autorización de tratamiento de datos personales',
	AUTHORIZATION_MECHANISMS: 'Mecanismos para otorgar la autorización de tratamiento de datos personales',
	AUTHORIZATION_PROOF: 'Prueba de la autorización',
	PERSONAL_INFO_SECURITY: 'Seguridad de la información personal',
	ADDITIONAL_PRIVACY_INFO: 'Información adicional sobre Privacidad y como contactar a EVIUS',
};
export const privacyLastUpdate: TLastUpdate = '29/12/2023';
export const privacyVersion: TVersion = '2.0.0';
export const privacyTitle: TLegalTitle = 'POLÍTICA DE TRATAMIENTO DE DATOS';
export const privacyParagraph: TLegalParagraphs = (
	<Typography.Paragraph>
		<Typography.Paragraph>
			EVIUS S.A.S. sociedad identificada con Nit No. 901262852 - 0 con domicilio en la Calle 67a 60-46 de la ciudad de
			Bogotá D.C. y con dirección electrónica tickets@evius.co, hacen de tu conocimiento que tus datos personales,
			incluyendo los sensibles, que actualmente o en el futuro obren en nuestras bases de datos, serán tratados y/o
			utilizados por: EVIUS S.A.S y/o aquellos terceros que, por la naturaleza de sus trabajos o funciones, tengan la
			necesidad de tratar y/o utilizar sus datos personales exclusivamente para las finalidades establecidas en el
			presente Aviso de Privacidad.
		</Typography.Paragraph>
		<Typography.Paragraph>
			Tus Datos Personales serán tratados bajo los lineamientos de la Ley 1581 de 2012, Decreto 1377 de 2.013, 1266 de
			2008 y demás normas que regulen la materia, así como aquellas que las modifiquen, adicionen, o sustituyan, con
			especial observancia de los principios de legalidad en materia de Tratamiento de datos, finalidad, libertad,
			veracidad o calidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad, sin embargo,
			nos reservamos el derecho de cambiar, modificar, complementar y/o alterar el presente aviso, en cualquier momento,
			en cuyo caso se hará de tu conocimiento a través de cualquiera de los medios que establece la legislación en la
			materia. Los presentes lineamientos se aplicarán tanto a EVIUS como a las prácticas de los Empresarios,
			Promotores, Agentes, Empleados y Contratistas de EVIUS cuya finalidad será la de salvaguardar tu información y dar
			un tratamiento adecuado, en los términos exigidos por la ley. La presente política de tratamiento de información y
			privacidad se aplicará a su vez, al uso que nuestros clientes hagan sobre el sitio web de EVIUS www.evius.co.
		</Typography.Paragraph>
	</Typography.Paragraph>
);
export const privacyAnchor: TLegalAnchor = [
	{ title: privacySections.INFO_COLLECTION, anchor: convertFormat(privacySections.INFO_COLLECTION) },
	{ title: privacySections.PERSONAL_INFO_USE, anchor: convertFormat(privacySections.PERSONAL_INFO_USE) },
	{ title: privacySections.INFO_SHARING, anchor: convertFormat(privacySections.INFO_SHARING) },
	{ title: privacySections.RIGHTS_HOLDER, anchor: convertFormat(privacySections.RIGHTS_HOLDER) },
	{
		title: privacySections.DATA_AUTHORIZATION_DURATION,
		anchor: convertFormat(privacySections.DATA_AUTHORIZATION_DURATION),
	},
	{ title: privacySections.PRIVACY_NOTICE_CHANGES, anchor: convertFormat(privacySections.PRIVACY_NOTICE_CHANGES) },
	{
		title: privacySections.PERSONAL_DATA_AUTHORIZATION,
		anchor: convertFormat(privacySections.PERSONAL_DATA_AUTHORIZATION),
	},
	{ title: privacySections.AUTHORIZATION_MECHANISMS, anchor: convertFormat(privacySections.AUTHORIZATION_MECHANISMS) },
	{ title: privacySections.AUTHORIZATION_PROOF, anchor: convertFormat(privacySections.AUTHORIZATION_PROOF) },
	{ title: privacySections.PERSONAL_INFO_SECURITY, anchor: convertFormat(privacySections.PERSONAL_INFO_SECURITY) },
	{ title: privacySections.ADDITIONAL_PRIVACY_INFO, anchor: convertFormat(privacySections.ADDITIONAL_PRIVACY_INFO) },
];

export const privacyContent: TLegalContent = [
	{
		title: <>{privacyAnchor[0].title}</>,
		anchor: privacyAnchor[0].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Se recopilan diferentes tipos de información relacionada contigo en función de los Servicios que uses.
				</Typography.Paragraph>
				<Typography.Paragraph>
					Recopilamos los datos personales que indicaste al momento de registrarte como lo son, tu nombre completo,
					correo electrónico, fecha de nacimiento, dirección de residencia y números de contacto, así como los datos
					financieros que nos proporcionas al momento de realizar cualquier tipo de transacción.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[1].title}</>,
		anchor: privacyAnchor[1].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					<ul>
						<li>Procesamiento y administración de sus transacciones como cliente de EVIUS.</li>
						<li>
							Establecemos un canal de comunicación contigo a fin de informarte las novedades que con respecto a los
							productos y servicios ofrecidos puedan ocurrir, tales como cancelación de eventos, cambio de fechas,
							cambio de programación, etc.
						</li>
						<li>
							Conocer sus hábitos de consumo, gustos y preferencias con la finalidad de ofrecerle aquellos productos que
							se adecuen a estos.
						</li>
						<li>Enviarte promociones y publicidad.</li>
						<li>Enviarte por correo electrónico los soportes de tu compra y transacción.</li>
					</ul>
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[2].title}</>,
		anchor: privacyAnchor[2].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					EVIUS no vende información personal sin tu consentimiento, sin embargo, EVIUS podría divulgar tu información
					personal en ciertas circunstancias como:
				</Typography.Paragraph>
				<Typography.Paragraph>
					<ul>
						<li>
							EVIUS puede compartir tu información personal a terceros contratistas y proveedores de servicios que nos
							ayudan a operar nuestros sistemas informáticos.
						</li>
						<li>
							La transferencia de tus datos de contrato al promotor o promotores de los eventos de los cuales adquiriste
							boletería para que ellos en calidad de responsables de la información y de los eventos puedan contactarte
							y recopilen esta información para realizar estadísticas y marketing.
						</li>
					</ul>
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[3].title}</>,
		anchor: privacyAnchor[3].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Según lo dispuesto en la Ley 1581 de 2012, tú o cualquier persona de las referidas en el Art. 20 del Decreto
					1377 de 2.013, tienen derecho a:
				</Typography.Paragraph>
				<Typography.Paragraph>
					<ol className='ol-upper-roman'>
						<li>
							Conocer, actualizar y rectificar sus datos personales frente a los responsables del Tratamiento o
							Encargados del Tratamiento.
						</li>
						<li>
							Solicitar prueba de la autorización otorgada al Responsable del Tratamiento, salvo cuando expresamente se
							exceptúe como requisito para el Tratamiento, de conformidad con lo previsto en el artículo 10 de la ley
							1581 de 2012.
						</li>
						<li>
							Ser informado por el Responsable del Tratamiento o el Encargado del Tratamiento, previa solicitud,
							respecto del uso que le ha dado a sus datos personales.
						</li>
						<li>
							Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a lo dispuesto en la
							presente ley y las demás normas que la modifiquen, adicionen o complementen.
						</li>
						<li>
							Revocar la autorización y/o solicitar la supresión del dato cuando en el Tratamiento no se respeten los
							principios, derechos y garantías constitucionales y legales. La revocatoria y/o supresión procederá cuando
							la Superintendencia de Industria y Comercio haya determinado que en el Tratamiento el responsable o
							Encargado han incurrido en conductas contrarias a esta ley y a la Constitución.
						</li>
						<li>Acceder en forma gratuita a sus datos personales que hayan sido objeto de Tratamiento.</li>
						<li>
							Ejercer el derecho fundamental al hábeas data en los términos de la Ley 1266 de 2008, mediante la
							utilización de los procedimientos de consultas o reclamos, sin perjuicio de los demás mecanismos
							constitucionales y legales. Así mismo tienen derecho a:
							<ol className='ol-lower-alpha'>
								<li>
									Solicitar el respeto y la protección de los demás derechos constitucionales o legales, así como de las
									demás disposiciones legales.
								</li>
								<li>Solicitar información de los usuarios autorizados para obtener dichos datos.</li>
							</ol>
						</li>
					</ol>
				</Typography.Paragraph>
				<Typography.Paragraph>
					EVIUS ha establecido los siguientes métodos para que puedas ejercer los derechos mencionados anteriormente:
				</Typography.Paragraph>
				<Typography.Paragraph>
					Puedes acceder, corregir, actualizar, suprimir o revocar tu información personal, podrás ingresar a nuestro
					sitio web www.evius.co con tu usuario y contraseña o escribirnos a nuestro correo electrónico habilitado para
					estos fines. Nuestra política considera que todas las peticiones de consulta de la información se contestarán
					por el mismo medio en que fue formulada la petición en un plazo de 10 días hábiles contados a partir de la
					fecha de recibo de esta. Cuando no fuere posible atender la solicitud dentro de dicho término, se informará al
					interesado, expresando los motivos de la demora y señalando la fecha en que se atenderá su consulta, la cual
					no podrá superar los 5 días hábiles siguientes al vencimiento del primer término, según lo dispuesto en el
					artículo 14 de la ley 1581 de 2012 y el artículo 16 de la ley 1266 de 2008. Si tienes algún reclamo
					evaluaremos tu petición y de ser el caso te requeriremos dentro de los 5 días siguientes a la recepción del
					reclamo para que subsanes las fallas y nos allegues la información faltante en un término máximo de dos (2)
					meses, so pena de considerar desistido su reclamo. Si la petición se encuentra en orden procederemos a incluir
					este reclamo en la base de datos, en la cual se podrá hacer seguimiento al trámite. Así mismo se te enviará un
					correo electrónico con el número de caso generado. La contestación será generada dentro de los 15 días hábiles
					siguientes a la recepción del reclamo, en caso de demora te informaremos las causas que dan lugar a la mismas
					y te indicaremos la fecha en la que se resolverá tu petición sin que dicho término pueda superar los 8 días
					hábiles siguientes al vencimiento del primer término, de conformidad con el artículo 15 de la ley 1581 de 2012
					y el artículo 16 de la ley 1266 de 2008. Si no encuentras solución alguna o respuesta por parte de EVIUS
					podrás acudir a la Superintendencia de Industria y Comercio para hacer valer tus derechos como consumidor.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[4].title}</>,
		anchor: privacyAnchor[4].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					El titular de los datos personales acepta y reconoce que esta autorización estará vigente a partir del momento
					en que la acepta y durante el tiempo en que EVIUS. ejerza las actividades propias de su objeto social.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[5].title}</>,
		anchor: privacyAnchor[5].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Cualquier cambio en los Términos y Condiciones y en el Aviso de Privacidad se notificará por medio de un
					correo electrónico al email que ingresaste en el formulario de registro; y será publicado en nuestro Sitio
					web; con acceso directo a los textos completos. Ahora, si el correo electrónico que usaste para registro no se
					encuentra habilitado, no será responsabilidad de EVIUS que no recibas dicha notificación.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[6].title}</>,
		anchor: privacyAnchor[6].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					La recolección, almacenamiento, uso, circulación o supresión de datos personales requiere del consentimiento
					libre, previo, expreso e informado del titular de estos. EVIUS en su condición de responsable del tratamiento
					de datos personales, ha dispuesto de los mecanismos necesarios para obtener la autorización de los titulares
					garantizando en todo caso que sea posible verificar el otorgamiento de dicha autorización. Así mismo ha
					establecido el área responsable de la atención de peticiones, consultas y reclamos ante la cual el titular de
					la información puede ejercer sus derechos a conocer, actualizar, rectificar y suprimir el dato y revocar la
					autorización.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[7].title}</>,
		anchor: privacyAnchor[7].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					Será puesto a disposición del titular previo al tratamiento de sus datos personales, de conformidad con lo que
					establece la Ley 1581 de 2102. Con el procedimiento de autorización consentida se garantiza que se ha puesto
					en conocimiento del titular de los datos personales, tanto el hecho que su información personal será recogida
					y utilizada para fines determinados y conocidos, como que tiene la opción de conocer cualquier alternación a
					los mismos y el uso específico que de ellos se ha dado. Lo anterior con el fin de que el titular tome
					decisiones informadas con relación a sus datos personales y controle el uso de su información personal. La
					autorización es una declaración que informa al titular de los datos personales
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[8].title}</>,
		anchor: privacyAnchor[8].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					EVIUS adoptará las medidas necesarias para mantener registros o mecanismos técnicos o tecnológicos idóneos de
					cuándo y cómo obtuvo autorización por parte de los titulares de datos personales para el tratamiento de estos.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[9].title}</>,
		anchor: privacyAnchor[9].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					¿Qué medidas está tomando EVIUS? Recopilación de información personal y no personal. Para cada visitante a
					nuestra página web, nuestro servidor reconoce automáticamente y almacena el nombre de dominio del visitante,
					pero no su dirección de correo electrónico, nuestro sitio web utiliza cookies. La mayoría de los navegadores
					web están configurados de forma predeterminada para aceptar cookies. Sin embargo, si usted no desea recibir
					cookies, puede configurar su navegador para solicitar o rechazar las cookies. También utilizamos cookies para
					el seguimiento de las estadísticas de nuestro sitio web. Esto nos permite entender mejor a nuestros usuarios y
					mejorar el diseño y la funcionalidad de nuestro sitio web. Este seguimiento se lleva a garantizando el
					anonimato de los visitantes. Publicidad en Línea de terceros. Para tratar de lograr que las ofertas sean de
					interés para usted, EVIUS tiene relaciones con otras empresas que nos permiten colocar anuncios en nuestras
					páginas web. Si usted visita nuestro sitio web, empresas de publicidad pueden recopilar información como su
					dominio, su dirección IP y la información de clics. Seguridad en las transacciones en línea. Si usted hace una
					compra a través de nuestra página web, procesamos los datos de su tarjeta de crédito de forma segura a través
					de Internet mediante un sistema de seguridad de Internet. Con la combinación del certificado cifrado SSL
					digital de EVIUS en nuestro sitio web y un navegador seguro, se toman todas las medidas para asegurar que su
					tarjeta de crédito y su anonimato sean protegidos cuando usted compra en línea. Enlaces a otros sitios web. A
					veces nuestro sitio web contiene enlaces a sitios web de terceros, para su conveniencia e información.
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
	{
		title: <>{privacyAnchor[10].title}</>,
		anchor: privacyAnchor[10].anchor,
		content: (
			<Typography.Paragraph>
				<Typography.Paragraph>
					EVIUS puede cambiar su Política de Privacidad en cualquier momento. EVIUS pondrá a disposición esta política a
					cualquier persona que lo solicite, ya sea en nuestras oficinas, puntos de venta o a través de nuestro sitio
					web. Para más información sobre su privacidad y la protección del consumidor visite: www.sic.gov.co. Si usted
					siente que EVIUS no está cumpliendo con esta Política de Privacidad, o si tiene otras preocupaciones de
					privacidad, por favor contacte a nuestro personal de servicio al cliente (utilizando los datos de contacto a
					continuación)
				</Typography.Paragraph>
			</Typography.Paragraph>
		),
	},
];
