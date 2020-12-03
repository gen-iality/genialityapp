import React from 'react';

export default function LiveChat(props) {
  if (!props.event || !props.activity) return <></>;
  return (
    <>
      {props.event._id !== '5f456bef532c8416b97e9c82' && props.event._id !== '5f8a0fa58a97e06e371538b4' && (
        <>
          {props.activity && props.activity.vimeo_id && (
            <iframe
              src={`https://vimeo.com/live-chat/${props.activity.vimeo_id}`}
              className='chat-vimeo'
              frameBorder='0'></iframe>
          )}
        </>
      )}
    </>
  );
}
