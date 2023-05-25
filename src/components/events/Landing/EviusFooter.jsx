import { useEventContext } from '@context/eventContext'

const EviusFooter = () => {
  const cEventContext = useEventContext()

  return (
    <>
      {cEventContext.value.styles && cEventContext.value.styles.banner_footer && (
        <div style={{ textAlign: 'center' }}>
          <img
            alt="image-dialog"
            src={cEventContext.value.styles.banner_footer}
            style={{
              width: '100%',
              maxWidth: '100%',
              maxHeight: '255px',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
    </>
  )
}

export default EviusFooter
