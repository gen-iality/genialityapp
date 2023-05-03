import { useEffect, useState } from 'react'
import { Card, Col, Row, Spin, Result, Button } from 'antd'
import TicketsForm from '../../tickets/formTicket'
import { connect } from 'react-redux'
import { useUserEvent } from '@context/eventUserContext'
import { useEventContext } from '@context/eventContext'
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions'
import { Redirect } from 'react-router-dom'
import { EventsApi } from '@helpers/request'
import ProductCard from '../producto/productCard'
import { withRouter } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import UserLoginContainer from '../UserLoginContainer'

const PageNotPermissions = (props) => {
  const EventUser = useUserEvent()
  const EventContext = useEventContext()
  let redirect
  const urlsection = `/landing/${EventContext.value._id}/`
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const { eventPrivate } = useHelper()

  const center = {
    margin: '30px auto',
    textAlign: 'center',
  }

  const obtenerGaleria = () => {
    setLoading(true)
    EventsApi.getProducts(EventContext.value._id).then((resp) => {
      if (resp && resp.data) {
        const threeList = resp.data.slice(0, 3)
        setProducts(threeList)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (EventUser.value == null) {
      props.setSectionPermissions({
        view: true,
        section: props.sectionPermissions.section,
      })
    }

    if (EventUser.value !== null) {
      redirect = 'evento'
    } else {
      obtenerGaleria()
      redirect = null
    }
  }, [])

  return (
    <>
      {eventPrivate.private ? (
        <Card hoverable>
          <Result
            // status="403"
            title="ESTE CURSO ES PRIVADO"
            subTitle={
              <div>
                <h1 style={{ fontSize: '20px' }}>Si estas incrito, ingresa tus datos</h1>
              </div>
            }
            // extra={<Button type="primary">Back home</Button>}
          />
          <UserLoginContainer eventId={EventContext.value._id} />
        </Card>
      ) : (
        <>
          {' '}
          {redirect !== null ||
            (redirect !== undefined && <Redirect to={`${urlsection}${redirect}`} />)}
          {/* Sección quemada para curso de subasta sileciosa FTDJ */}
          {loading && (
            <div style={{ textAlign: 'center' }}>
              <Spin></Spin>
            </div>
          )}
          {!loading && (
            <Col xs={24} sm={22} md={18} lg={18} xl={18} style={center}>
              {props.sectionPermissions.view && (
                <Card>
                  <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>
                    {props.sectionPermissions.section ? (
                      <>
                        Para poder ver la sección{' '}
                        <a style={{ fontWeight: 'bold' }}>
                          {props.sectionPermissions.section}
                        </a>{' '}
                        tienes que estar registrado en este curso
                      </>
                    ) : (
                      <>
                        Para poder ver esta sección tienes que estar registrado en este
                        curso
                      </>
                    )}
                  </h1>
                </Card>
              )}
            </Col>
          )}
          {!props.sectionPermissions.ticketview && !loading && (
            <TicketsForm setVirtualConference={props.setVirtualConference} />
          )}
        </>
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
})

const mapDispatchToProps = {
  setSectionPermissions,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(PageNotPermissions))
