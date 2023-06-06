import { app } from '@helpers/firebase'
import { EventsApi } from '@helpers/request'
import { useEffect, useState } from 'react'
import ResultLink from './ResultLink'
import { FB } from '@helpers/firestore-request'

const WithCode = () => {
  const [email, setEmail] = useState()
  const [event, setEvent] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [verifyLink, setVerifyLink] = useState(false)

  useEffect(() => {
    // Referencia firestore para verificar si el usuario esta conectado

    const querystring = window.location.search
    const params = new URLSearchParams(querystring)
    let email = params.get('email')
    const event = params.get('event_id')
    if (email) {
      setEmail(email)
      setEvent(event)
      email = email.replace('%40', '@')
      FB.Connections.getAllByEmail(email, true).then(async (resp) => {
        if (
          (resp.docs.length == 0 && app.auth()?.currentUser?.email != email) ||
          (app.auth().currentUser?.email == email && resp.docs.length > 0) ||
          (resp.docs.length == 0 && !app.auth()?.currentUser)
        ) {
          if (app.auth().currentUser) {
            await app.auth().signOut()
            const docRef = await FB.Connections.getAllByEmail(email, true)
            if (docRef.docs.length > 0) {
              await FB.Connections.delete(docRef.docs[0].id)
            }
            await loginWithCode()
          } else {
            await loginWithCode()
          }
        } else {
          setError(true)
          setIsLoading(false)
        }
      })
    }
    async function loginWithCode() {
      app
        .auth()
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          setVerifyLink(true)
          let urlredirect
          if (event && result) {
            urlredirect = `${window.location.origin}/landing/${event}`
          } else {
            urlredirect = `${window.location.origin}`
          }
          if (urlredirect) {
            setTimeout(() => redirectUrlFunction(), 3000)
            const redirectUrlFunction = () => {
              window.location.href = urlredirect
            }
          }
        })
        .catch(async (err) => {
          console.error(err)
          let refreshLink
          if (event) {
            refreshLink = await EventsApi.refreshLinkEmailUserEvent(email, event)
          } else {
            refreshLink = await EventsApi.refreshLinkEmailUser(email)
          }
          if (refreshLink) {
            setTimeout(() => (window.location.href = refreshLink), 3000)

            /*fetch(refreshLink).then((result) => {
              if (event && result) {
                // window.location.href = `${window.location.origin}/landing/${event}`;
              } else {
                window.location.href = `${window.location.origin}`;
              }
            });*/
          }
        })
    }
  }, [])
  return (
    <>
      {isLoading ? (
        <ResultLink status="loading" verifyLink={verifyLink} data={email} />
      ) : error ? (
        <ResultLink status="error" data={email} event={event} />
      ) : (
        ''
      )}
    </>
  )
}

export default WithCode
