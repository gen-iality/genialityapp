import { FB } from '@helpers/firestore-request'

class Service {
  constructor() {}

  validateHasVideoconference = (event_id, activity_id) => {
    // eslint-disable-next-line no-unused-vars
    return new Promise((resolve) => {
      if (!event_id || !activity_id) resolve(false)
      FB.Activities.get(event_id, activity_id).then((activity) => resolve(!!activity))
    })
  }

  createOrUpdateActivity = (event_id, activity_id, roomInfo, tabs) => {
    //SI EXISTE ACTIVITY ID SI NO SE ROMPE AL CREAR LA ACTIVIDAD
    if (activity_id) {
      console.log(event_id, activity_id, roomInfo, tabs, 'service')
      const tabsSchema = { attendees: false, chat: true, games: false, surveys: false }
      const {
        roomState,
        habilitar_ingreso,
        platform,
        meeting_id,
        isPublished,
        host_id,
        host_name,
        typeActivity,
      } = roomInfo
      // eslint-disable-next-line no-unused-vars

      return new Promise((resolve) => {
        this.validateHasVideoconference(event_id, activity_id).then((existActivity) => {
          if (existActivity) {
            FB.Activities.update(event_id, activity_id, {
              habilitar_ingreso,
              platform,
              meeting_id,
              tabs,
              isPublished: isPublished,
              host_id,
              host_name,
              typeActivity: typeActivity || null,
              transmition: roomInfo.transmition || null,
              avalibleGames: roomInfo?.avalibleGames || [],
            })
              .then(() =>
                resolve({ message: 'Configuración actualizada', state: 'updated' }),
              )
              .catch((err) => console.error('11. ERROR==>', err))
          } else {
            FB.Activities.edit(event_id, activity_id, {
              habilitar_ingreso,
              platform,
              meeting_id,
              isPublished: isPublished || false,
              host_id,
              host_name,
              tabs: tabsSchema,
              typeActivity: typeActivity || null,
              avalibleGames: roomInfo?.avalibleGames || [],
              roomState: roomState || null,
            })
              .then(() => resolve({ message: 'Configuración creada', state: 'created' }))
              .catch((err) => console.error('11. ERROR==>', err))
          }
        })
      })
    }
  }

  /** @deprecated use helpers/firestore-request.ts FB.Activities.get instead */
  getConfiguration = (event_id, activity_id) => {
    return new Promise((resolve, reject) => {
      FB.Activities.get(event_id, activity_id)
        .then((result) => {
          if (result) {
            resolve(result)
          } else {
            resolve()
          }
        })
        .catch((err) => {
          reject('Hubo un problema ', err)
        })
    })
  }

  /** @deprecated use helpers/firestore-request.ts instead */
  deleteActivity = (event_id, activity_id) => {
    return new Promise((resolve, reject) => {
      FB.Activities.delete(event_id, activity_id)
        .then(() => resolve('Eliminado'))
        .catch((err) => {
          reject('Hubo un problema ', err)
        })
    })
  }

  setZoomRoom = (token, data) => {
    const url = `https://apimeetings.evius.co:6490/crearroom?token=${token}`

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
          method: 'POST',
        })
          .then(async (response) => {
            if (response.status === 400) {
              resolve({
                message: 'No está disponible el host para la fecha/hora indicada',
                state: 'error',
              })
            } else {
              return await response.json()
            }
          })
          .then((data) => {
            resolve(data)
          })
      } catch (err) {
        console.error('Error: ' + err)
      }
    })
  }

  getZoomRoom = (data) => {
    const url = `https://apimeetings.evius.co:6490/obtenerMeeting`

    return new Promise((resolve) => {
      try {
        fetch(url, {
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(data),
          method: 'POST',
        })
          .then(async (response) => await response.json())
          .then((data) => {
            resolve(data)
          })
      } catch (err) {
        console.error('Error: ' + err)
      }
    })
  }

  deleteZoomRoom = (event_id, meeting_id) => {
    const url = `https://apimeetings.evius.co:6490/deleteroom?meeting_id=${meeting_id}&event_id=${event_id}`

    return new Promise((resolve) => {
      try {
        fetch(url, { method: 'DELETE' }).then((response) => resolve(response))
      } catch (err) {
        console.error('Error: ' + err)
      }
    })
  }
}

export default Service
