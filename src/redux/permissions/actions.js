import { Actions } from '@helpers/request'
import { GetTokenUserFirebase } from '@helpers/HelperAuth'

export function fetchPermissions(event) {
  return async (dispatch) => {
    const token = await GetTokenUserFirebase()

    dispatch(fetchPermissionsBegin())
    Actions.get(`api/contributors/events/${event}/me?token=${token}`)
      .then((data) => {
        let roles = data.role ? data.role.permission_ids : ['5c19242ff33bd46c102ec975']
        roles = ['5c19242ff33bd46c102ec975']

        dispatch(fetchPermissionsSuccess({ ids: roles, space: [] }))
      })
      .catch((e) => {
        dispatch(fetchPermissionsFailure(e))
      })
  }
}

export const FETCH_PERMISSIONS_BEGIN = 'FETCH_PERMISSIONS_BEGIN'
export const FETCH_PERMISSIONS_SUCCESS = 'FETCH_PERMISSIONS_SUCCESS'
export const FETCH_PERMISSIONS_FAILURE = 'FETCH_PERMISSIONS_FAILURE'

export const fetchPermissionsBegin = () => ({
  type: FETCH_PERMISSIONS_BEGIN,
})

export const fetchPermissionsSuccess = (permissions) => ({
  type: FETCH_PERMISSIONS_SUCCESS,
  payload: permissions,
})

export const fetchPermissionsFailure = (error) => ({
  type: FETCH_PERMISSIONS_FAILURE,
  payload: { error },
})
