export default function LiveChat(props) {
  if (!props.event || !props.activity) return <></>;
  return (
    <>
      {props.meeting_id && (
        <iframe
          src={`https://vimeo.com/live-chat/${props.meeting_id}`}
          className="chat-vimeo"
          frameBorder="0"></iframe>
      )}
    </>
  );
}
