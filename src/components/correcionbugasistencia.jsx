import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AgendaApi, EventFieldsApi, EventsApi, Networking } from '@helpers/request'
import { firestore } from '@helpers/firebase'
import { FB } from '@helpers/firestore-request'
import { AttendeeApi, SearchUserbyEmail } from '@helpers/request'
/**
 * 
usuario con 15 vistas
	lalinde50@gmail.com
  event_user = 64d274689f470a401408490b
*/

let alumnos = [
	'rubencho95@hotmail.es',
	'ruthisabelimbett@gmail.com',
	'sandra.perez.perez@hotmail.com',
	'valentinacastrocano35@gmail.com',
	'gutierrezzuluagav@gmail.com',
	'jack-1992@hotmail.es',
	'carohenao12@hotmail.com',
	'julianacastrohenao@gmail.com',
	'nataliarestrepo.15@hotmail.com',
	'valentinachicue1@gmail.com',
	'andresj9004@gmail.com',
	'cindyramirezl@hotmail.com',
	'mszaratez@hotmail.com',
	'fredyj-lizarazod@unilibre.edu.co',
	'gloriasoto2@gmail.com',
	'humbertoa-natic@unilibre.edu.co',
	'isabellam-larap@unilibre.edu.co',
	'juanj-martinezp@unilibre.edu.co',
	'ladyv-acostac@unilibre.edu.co',
	'laurac-quirogac@unilibre.edu.co',
	'tomasa-acostap@unilibre.edu.co',
	'care98400@gmail.com',
	'dalis214cordoba@gmail.com',
	'jimmyerasoleon@gmail.com',
	'loren15_ap@hotmail.com',
	'nathalialopezy@hotmail.com',
	'deam1808@hotmail.com',
	'andresacostai@hotmail.com',
	'juanarevalo0423@gmail.com',
	'christiancaamilo@gmail.com',
	'michellepmart@gmail.com',
	'nataleytonl@gmail.com',
	'saragonama@gmail.com',
	'nando_avalanch86@hotmail.com',
	'santisimatrinidad2022@gmail.com',
	't_reissy@hotmail.com',
	'cindyramirezl@hotmail.com',
	'ospigilgloria@gmail.com',
	'estiven1112@hotmail.com',
	'giiseochva1@gmail.com',
	'sandra.milena.zapata@hotmail.com',
	'tybc2009@gmail.com',
	'jeison5991@gmail.com',
	'li.villamizar35@gmail.com',
	'andrea.montoyaq@gmail.com',
	'luisa.f1997@hotmail.com',
	'cindyramirezl@hotmail.com',
	'lauyep.cal96@gmail.com',
	'aetamayoe@gmail.com',
	'tati.areiza21@gmail.com',
	'mariaclara1226@hotmail.com',
	'alexandravelascopoli@gmail.com',
	'mavama608@gmail.com',
	'vivianamariagutierrez@hotmail.com',
	'sara.higuitag@gmail.com',
	'yulianamart29@gmail.com',
	'kcontrerasv10@curnvirtual.edu.co',
	'les_ica@hotmail.com',
	'diamargaritavivic@hotmail.com',
	'valeriaz-03@hotmail.com',
	'mariatoro1@gmail.com',
	'rua1991@hotmail.com',
	'julifh2006@hotmail.com',
	'arquivasquez92@hotmail.com',
	'canog.daniela@uces.edu.co',
	'angcru32@hotmail.com',
	'jogoma86@gmail.com',
	'jfparraco@gmail.com',
	'gjaime.correa22@gmail.com',
	'thalia.ramirez.montoya@gmail.com',
	'edward_escamilla@hotmail.com',
	'yepavemen@gmail.com',
	'samiraruizgonzalez@gmail.com',
	'ruthisabelimbett@gmail.com',
	'paulagamara@gmail.com',
	'milenadelcarmeng62@gmail.com',
	'medmaap2015@hotmail.com',
	'mariavictoriaromerocastro@gmail.com',
	'mariaisabelherndezsantiz@gmail.com',
	'luisafer903@hotmail.com',
	'luisa1312ariza@gmail.com',
	'lorenafloar@gmail.com',
	'cjcstar@gmail.com',
	'kabego_17@hotmail.com',
	'juandrivera429@gmail.com',
	'medrano.jhonatan28@gmail.com',
	'jeniffercamposierra@gmail.com',
	'javierfontanilla19@gmail.com',
	'pao_velaz@hotmail.com',
	'emmussy@gmail.com',
	'cielitoesthergv1@gmail.com',
	'bersaysantero@gmail.com',
	'thiago0403@outlook.es',
	'averbelv@gmail.com',
	'12olivar@gmail.com',
	'yeiligarcia6@gmail.com',
	'espinosac0371@gmail.com',
	'sarquid_romero@hotmail.com',
	'sagarcia142@gmail.com',
	'oscarmmo@gmail.com',
	'thalialopezy@hotmail.com',
	'midapili_06@hotmail.com',
	'mavama608@gmail.com',
	'marolyandreaduarte@hotmail.com',
	'malwvabu5@gmail.com',
	'laura.9426@hotmail.com',
	'jpovedamd@gmail.com',
	'jeison5991@gmail.com',
	'ingry1803@gmail.com',
	'geraldinemarin30@gmail.com',
	'bmartinez219@ub.edu.co',
	'adrigobe06@hotmail.com',
	'luis.manuel1009@hotmail.com',
	'andrea.sandoval217@hotmail.com',
	'jpablorua@gmail.com',
	'jeremyany@hotmail.com',
	'saritau1@hotmail.com',
	'mary77lu@hotmail.com',
	'ingridtamayo221815@gmail.com',
]
let extraer_objeto_activities_ids = (activities) => {
	let activities_ids = []

	activities.data.map(async (activity) => {
		activities_ids.push(activity._id)
	})
	return {
		activities: activities_ids,
		filtered_activities: activities_ids,
		viewed_activities: activities_ids,
	}
}

let corregir_progreso = async (asistente, eventId, activities) => {
	let clases = extraer_objeto_activities_ids(activities)
	let data = {
		activities_progress: clases.viewed_activities?.length,
		activity_progresses: clases,
	}
	console.log('asistente incorrecto', asistente._id, clases.viewed_activities?.length)
	//Corregirlo en MONGODB
	await AttendeeApi.update(eventId, data, asistente._id)

	//Corregirlo en FIREBASE en asistentes evento
	const document = await firestore
		.collection(`${eventId}_event_attendees`)
		.doc(asistente._id)
		.update(data)

	await corregir_progreso_en_cada_leccion_firebase(asistente, activities)

	//Corregirlo en FIREBASE en cada lección

	console.log('asistente actualizado ', asistente._id, clases.viewed_activities?.length)
}

let corregir_progreso_en_cada_leccion_firebase = async (asistente, activities) => {
	let actividades_atendidas = []
	let activities_ids = []
	return new Promise((resolve, reject) => {
		Promise.all(
			activities.data.map(async (activity) => {
				const document = await firestore
					.collection(`${activity._id}_event_attendees`)
					.doc(asistente._id)
					.get()
				if (!document.exists) {
					const document = await firestore
						.collection(`${activity._id}_event_attendees`)
						.doc(asistente._id)
						.set(asistente)
				}
				//console.log('existen', activity._id, document.exists)
			}),
		)
			.then(() => {
				resolve(activities)
			})
			.catch((e) => {
				reject(e)
			})
	})
}

const Correcionbugasistencia = (props) => {
	useEffect(() => {
		console.log('---INICIO-----')

		let asincrona = async () => {
			//let eventId = '64604fd615f36a1bdd022296' // ACV
			let eventId = '646400747c3802bab5066692' //NHISS

			const activities = await AgendaApi.byEvent(eventId)
			console.log('activities', activities)

			//let asistente_id = '653ff8c966eed9c9e30b9b5b'
			//let asistente = await AttendeeApi.getOne(asistente_id, eventId)

			// let asistente = await SearchUserbyEmail('aeeluna08@gmail.com')

			// asistente = asistente[0]
			// asistente = await EventsApi.getEventUser(asistente._id, eventId)
			// console.log('asistente', asistente)

			//let asistentes = await AttendeeApi.getAll(eventId)
			//console.log('asistentes', asistentes)

			for (const alumnocorreo of alumnos) {
				let usuario = await SearchUserbyEmail(alumnocorreo)
				if (!usuario || !usuario.length) continue

				usuario = usuario[0]

				let asistente = await EventsApi.getEventUser(usuario._id, eventId)

				if (!asistente || !asistente._id) continue
				console.log('Iniciando con...', asistente._id)
				const resultado = await corregir_progreso(asistente, eventId, activities)
				console.log('corregido finalizado...', asistente._id)
			}
			////let eventUserId = '650e72aaf8a1941bf30b20df'   NHISS

			//let eventUserId = '6512f1a9cd493103db013757' //con fallo tiene 2 debería tener 59
			//let eventUserId = '64d274689f470a401408490b' //tiene 15 // ahora esta en 37
			//let eventUserId = '6512f1b02192687f890bf6f9' //tiene 13 en total este esta bien // 6512f1b02192687f890bf6f9
		}
		asincrona()
	}, [])

	return <>HOLA</>
}
export default Correcionbugasistencia

let consultar_progreso_real_estudiante_firebase = async (
	eventUserId,
	eventId,
	activities,
) => {
	console.log('asistente iniciando', eventUserId)
	let actividades_atendidas = []
	let activities_ids = []
	return new Promise((resolve, reject) => {
		Promise.all(
			activities.data.map(async (activity) => {
				const document = await firestore
					.collection(`${activity._id}_event_attendees`)
					.doc(eventUserId)
					.get()
				activities_ids.push(activity._id)
				if (document.exists) actividades_atendidas.push(activity._id)
				//console.log('existen', activity._id, document.exists)
			}),
		)
			.then((respuestas) => {
				console.log('total', actividades_atendidas.length)
				resolve({
					activities: activities_ids,
					filtered_activities: activities_ids,
					viewed_activities: actividades_atendidas,
				})
			})
			.catch((e) => {
				reject(e)
			})
	})
}

/** 
 // Usuarios con progreso total en el curso ACV 64604fd615f36a1bdd022296
db.event_users.find({
  "activity_progresses.viewed_activities": { $all: ["64638a0d5e3323cd7604ec23","64638a09c08b12bc00012b23", "64638a0826760012fa032472", "64638a0c5df41972420dedd5", "64638a0b26760012fa032473", "64638a068ef5c7ac5b0f9122", "64638a066ba92bf1700ca7d3", "64638a126ba92bf1700ca7d8", "64638a0803dcaa1446067e94", "64638a0e26760012fa032474", "64638a0e5df41972420dedd6", "64638a056ba92bf1700ca7d2", "64638a105e3323cd7604ec24", "64638a1026760012fa032475", "64638a0603dcaa1446067e93", "64638a0b03dcaa1446067e95", "64638a14c08b12bc00012b27", "64638a135e3323cd7604ec25", "64638a138ef5c7ac5b0f9128", "64638a145df41972420dedd9", "64638a155e3323cd7604ec26", "64604fd895e4deac6a01f452", "64638a0c8ef5c7ac5b0f9125", "64638a065df41972420dedd2", "647f9afc8f039bca2600af42", "64638806c4865ec1ca04e363", "64638a0a6ba92bf1700ca7d5", "64638a0e8ef5c7ac5b0f9126", "647f9b17d24308109c04e902", "647f9f668eae8979f60a9b52", "64638a0d03dcaa1446067e96", "64638a11c08b12bc00012b26", "647f9b374dcf29d5690316f3", "647f9b574dcf29d5690316f4", "64638a07c08b12bc00012b22", "64638a1403dcaa1446067e99", "64638a105df41972420dedd7", "64638a0a5e3323cd7604ec22", "64638a1003dcaa1446067e97", "64638a0ec08b12bc00012b25", "64638a146ba92bf1700ca7d9", "64638a1526760012fa032477", "6463aa85d785c1e599088252", "64638a1203dcaa1446067e98", "64638a1226760012fa032476", "64638a0cc08b12bc00012b24", "64638a078ef5c7ac5b0f9123", "64638a0c6ba92bf1700ca7d6", "6463ac94a97e4c6657015062", "647fa0008f039bca2600af45", "64638a108ef5c7ac5b0f9127", "64638a0a5df41972420dedd4", "64638a086ba92bf1700ca7d4", "64638a085df41972420dedd3", "64638a0a8ef5c7ac5b0f9124", "64638a0f6ba92bf1700ca7d7", "64638a125df41972420dedd8", "647e5d44c4d2203a10088575", "6467ec6d756e3a1732071722"] }
})
.sort({
  _id: -1
})
.limit(10000)
 * 
 
// Usuarios con progreso total en el curso NHISS 646400747c3802bab5066692
db.event_users.find({
  "activity_progresses.viewed_activities": { $all: [	"64c41658bc79edb2f40f8532", "64640077cbc0adca6d01bca2", "648c800bb6065a055f0f6712", "648c8071b6065a055f0f6714", "648c80c5ff36464b060e39d4", "648c81028ffcab89000f8ef3", "648c814057a873b19b0bba13", "648c817f33e0c5cd130d1d93", "648c81ab57a873b19b0bba15", "648c81d833e0c5cd130d1d94", "648c820bc1b0a62e750b53a2", "648c823c1c5a578e120023c2", "648c8333bedc724ff50f1c42", "648c991bbfc9f6cb7108bf62", "648c99739e244c66030afcf3", "648ca726bebdbba7580edab2", "648ca78532f9cc9c0a03da52", "648ca8029ae1414966006274", "648ca833bebdbba7580edab5", "648ca875bebdbba7580edab6", "648ca8a99ae1414966006276", "648ca8e1bebdbba7580edab7", "648ca90b9ae1414966006278", "648ca936bebdbba7580edab8", "648ca9fbc2358432b405c352", "648caa51f81ccf8c9100f752", "648caa83c2358432b405c354", "648caaa6f81ccf8c9100f754", "648caad8f81ccf8c9100f756", "648cab0832f9cc9c0a03da57", "648cab42f81ccf8c9100f758", "648cab7af81ccf8c9100f759", "648caba032f9cc9c0a03da59", "648cb0ff7b3840952d02ff08", "648cabd2f81ccf8c9100f75c", "648cac02c2358432b405c355", "648cac4bf81ccf8c9100f75e", "648cac85f81ccf8c9100f75f", "648cacb5f81ccf8c9100f760", "64c0497bbbf808d95409ab52", "64c04a49758b4ecbb90601f2", "64c04b6dc3b60139190eebe2", "64c04c1a8137ac96f00b3992", "64c04c5e8137ac96f00b3993", "64c04cc18fa2fba8770401c2", "64c04d1294946c67ff0c8423", "64c04d6a1402feb40506a8f2", "64c04e1b0823a49773076e92", "64c3ee542ec251e1f9024572", "64c3f25e21748099740c16f2", "64c3f29821748099740c16f4", "64c3f2c15add1bcc22051e32", "64c3f30a22f39b2ffb019664", "64c3f3865add1bcc22051e33", "64bfd63071ebe3fdca053d62"] }
})
.sort({
  _id: -1
})
.limit(10000)
 		 */
