import { FB } from '@helpers/firestore-request'

export const validateActivityCreated = (activityId, event_id) => {
  return new Promise((resolve) => {
    FB.Activities.ref(event_id, activityId).onSnapshot((survey) => {
      if (!survey.exists) {
        resolve(false)
      }
      resolve(true)
    })
  })
}

export const createOrUpdateActivity = (activityId, event_id, activityInfo, tabs) => {
  const tabsSchema = { attendees: false, chat: true, games: false, surveys: false }
  return new Promise((resolve) => {
    validateActivityCreated(activityId, event_id).then((existSurvey) => {
      if (existSurvey) {
        FB.Activities.update(event_id, activityId, {
          habilitar_ingreso: activityInfo,
          tabs: tabs,
        }).then(() => resolve({ message: 'Configuración actualizada', state: 'updated' }))
      } else {
        FB.Activities.edit(event_id, activityId, {
          habilitar_ingreso: activityInfo,
          tabs: tabsSchema,
        }).then(() => resolve({ message: 'Configuracioón Creada', state: 'created' }))
      }
    })
  })
}

export const getConfiguration = (event_id, activityId) => {
  return new Promise((resolve, reject) => {
    FB.Activities.get(event_id, activityId)
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
