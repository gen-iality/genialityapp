import { Empty, Col, Row } from 'antd'
import Companylist from './companyList'
import { useEffect } from 'react'
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies'
import MiniBanner from './MiniBanner'
import { useState } from 'react'
import { connect } from 'react-redux'
import { setVirtualConference } from '../../../redux/virtualconference/actions'
import FeriaStand from './FeriasStand'
import { firestore } from '@helpers/firebase'
import withContext from '@context/withContext'

const FeriasList = ({ event_id, setVirtualConference, setTopBanner, cEvent }) => {
  const [companies, loadingCompanies] = useGetEventCompanies(event_id)
  const [companiesEvent, setCompaniesEvent] = useState([])
  const [config, setConfig] = useState(null)
  const [standsColor, setStandsColor] = useState()
  const [imageBanner, setBannerImage] = useState()
  const [typeStand, setTypeStand] = useState()
  // Efecto para ocultar y mostrar virtual conference
  useEffect(() => {
    setVirtualConference(false)
    setBannerImage(cEvent.value.styles.banner_image)
    return () => {
      setVirtualConference(true)
    }
  }, [])
  useEffect(() => {
    if (!loadingCompanies) {
      firestore
        .collection('event_companies')
        .doc(event_id)
        .onSnapshot((resp) => {
          const standTypesOptions = resp.data()?.stand_types
          setTypeStand(standTypesOptions)
          setStandsColor(standTypesOptions)
          setConfig(resp.data()?.config)
          const companiesSort = companies.sort(
            (a, b) => a.index && b.index && a.index - b.index,
          )
          setCompaniesEvent(companiesSort)
        })
    }
  }, [loadingCompanies])
  const obtenerColor = (stand) => {
    if (standsColor) {
      const colorList = standsColor.filter((colors) => colors.label === stand)
      if (colorList.length > 0) {
        return colorList[0].color
      }
    }

    return '#2C2A29'
  }
  const obtenertLabel = (stand) => {
    if (typeStand) {
      const labelList = typeStand.filter((colors) => colors.label === stand)
      if (labelList.length > 0) {
        return labelList[0].label
      }
    }

    return 'Stand'
  }

  const isListVisualization = () => {
    if (!config) {
      return true
    } else if (config.visualization === 'list' || !config.visualization) {
      return true
    } else {
      return false
    }
  }
  return (
    <div style={{ paddingBottom: '30px' }}>
      <MiniBanner banner={imageBanner} />
      {companiesEvent.length > 0 &&
        isListVisualization() &&
        companiesEvent.map(
          (company, index) =>
            company.visible && (
              <Companylist
                key={'companyList' + index}
                img={
                  company.list_image === ''
                    ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Logo' // imagen por defecto si no encuentra una imagen guardada
                    : company.list_image
                }
                eventId={event_id}
                name={company.name}
                position={company.position}
                tel={company.advisor && company.telefono}
                email={company.advisor && company.email}
                description={company.short_description}
                pagweb={company.webpage}
                companyId={company.id}
                colorStand={obtenerColor(company.stand_type)}
                text={obtenertLabel(company.stand_type)}
              />
            ),
        )}
      {/*PARA OTRO TIPO DE VISUALIZACION */}

      <Row>
        {companiesEvent.length > 0 &&
          !isListVisualization() &&
          companiesEvent.map(
            (company, index) =>
              company.visible && (
                <Col key={index} sm={24} xs={24} md={12} lg={12} xl={8} xxl={8}>
                  <FeriaStand
                    image={
                      company.list_image === ''
                        ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Logo' // imagen por defecto si no encuentra una imagen guardada
                        : company.list_image
                    }
                    eventId={event_id}
                    name={company.name}
                    companyId={company.id}
                    color={obtenerColor(company.stand_type)}
                    text={obtenertLabel(company.stand_type)}
                  />
                </Col>
              ),
          )}
      </Row>
      {companiesEvent.length == 0 && <Empty />}
    </div>
  )
}
const mapDispatchToProps = {
  setVirtualConference,
}
export default connect(null, mapDispatchToProps)(withContext(FeriasList))
