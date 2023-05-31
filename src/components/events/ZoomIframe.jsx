import { useState, useEffect } from 'react'
import { useUserEvent } from '@context/eventUserContext'
import { isHost } from '@helpers/helperEventUser'
import { useEventContext } from '@context/eventContext'
import WOWZAPlayer from '../livetransmision/WOWZAPlayer'

const IframeZoomComponent = ({
  platform,
  name,
  email,
  meeting_id,
  generalTabs,
  isHost,
}) => {
  const [platformurl, setPlatformurl] = useState(null)

  useEffect(() => {
    if (!meeting_id) return
    getMeetingPath(platform, name, email, meeting_id, generalTabs, isHost)
    checkStreamStatus()
  }, [meeting_id])

  const checkStreamStatus = async () => {
    setTimeout(checkStreamStatus, 5000)
  }

  const getMeetingPath = async (
    platform,
    name,
    email,
    meeting_id,
    generalTabs,
    isHost,
  ) => {
    console.log('platform', platform)
    let url = null
    switch (platform) {
      case 'zoom':
        const url_conference = `https://gifted-colden-fe560c.netlify.com/?meetingNumber=`
        url =
          url_conference +
          meeting_id +
          `&userName=${name}` +
          `&email=${email}` +
          `&disabledChat=${generalTabs ? generalTabs.chat : false}` +
          `&host=${isHost}`
        break

      case 'vimeo':
        url = `https://player.vimeo.com/video/${meeting_id}`
        break
      case 'dolby':
        // url = `https://stagingeviusmeet.netlify.app/?username=${name}&email=${email}`
        url = 'https://meet.evius.co'
        break
      case 'streaming':
        break
    }

    setPlatformurl(url)
  }

  return (
    <>
      {platform === 'streaming' ? (
        <>
          <WOWZAPlayer meeting_id={meeting_id} />
        </>
      ) : (
        <iframe
          src={platformurl}
          frameBorder="0"
          allow="autoplay; fullscreen; camera *;microphone *"
          allowFullScreen
          allowusermedia
          width="100%"
          height="100%"
          style={{ aspectRatio: '16/9' }}
        ></iframe>
      )}
    </>
  )
}

const ZoomIframe = ({ platform, meeting_id, generalTabs }) => {
  const cEventuser = useUserEvent()
  const cEvent = useEventContext()
  const [userEvent, setuserEvent] = useState({})
  useEffect(() => {
    if (!cEventuser.value || !cEvent.value) return
    const { displayName, email } = cEventuser.value.properties
    setuserEvent({
      displayName: displayName,
      email: email,
      isHostuser: isHost(cEventuser.value, cEvent.value),
    })
  }, [cEventuser.value, cEvent.value])

  return (
    <IframeZoomComponent
      platform={platform}
      name={userEvent.displayName}
      email={userEvent.email}
      meeting_id={meeting_id}
      generalTabs={generalTabs}
      isHost={userEvent.isHostuser}
    />
  )
}

export default ZoomIframe
