import { FB } from '@helpers/firestore-request'

export const setHostState = async (hostId, state) => {
  try {
    FB.Hosts.update(hostId, { busy: state })
    return { message: 'El host ha sido actualizado' }
  } catch (err) {
    console.error(err)
    return { message: err }
  }
}

export const getAllHost = () => {
  return new Promise((resolve, reject) => {
    FB.Hosts.collection().onSnapshot((docs) => {
      const hostList = []
      if (docs.empty) {
        resolve(false)
      }
      docs.forEach((host) => {
        hostList.push({ _id: host.id, ...host.data() })
      })
      resolve(hostList)
    })
  })
}

export default (loadHost) => {
  FB.Hosts.collection()
    .where('busy', '==', false)
    .onSnapshot((docs) => {
      const hostList = []
      if (!docs.empty) {
        docs.forEach((host) => {
          hostList.push({ _id: host.id, ...host.data() })
        })
        loadHost(hostList)
      }
    })
}
