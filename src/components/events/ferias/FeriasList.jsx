import { Empty, Spin, Col, Row} from 'antd';
import React from 'react';
import Companylist from './companyList';
import { useEffect } from 'react';
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies';
import { useState } from 'react';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import FeriaStand from './FeriasStand'
import {setTopBanner} from '../../../redux/topBanner/actions';
import { firestore } from '../../../helpers/firebase';

const FeriasList = ({ event_id,setVirtualConference,setTopBanner }) => {
  const [companies, loadingCompanies] = useGetEventCompanies(event_id);
  const [companiesEvent, setCompaniesEvent] = useState([]);
  const [config,setConfig]=useState(null)
  //EFECTO PARA OCULTAR Y MOSTRAR VIRTUAL CONFERENCE
  useEffect(()=>{
  setVirtualConference(false);
  setTopBanner(false);

  return ()=>{
    setVirtualConference(true);
    setTopBanner(true); 
  }
  },[])
  useEffect(() => {
    if (!loadingCompanies) {
      firestore
      .collection('event_companies')
      .doc(event_id).onSnapshot((resp)=>{
        setConfig(resp.data().config)
        setCompaniesEvent(companies);
        console.log(resp.data())
        console.log(resp.data().config.visualization)
      })
      
    }
  }, [loadingCompanies]);

  return (
    <div>
      {loadingCompanies && <Spin size='small' />}

      {companiesEvent.length > 0 && config.visualization==='list' &&
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
              />
            )
        )}
       {/*PARA OTRO TIPO DE VISUALIZACION */} 
       {companiesEvent.length > 0 && config.visualization==='stand' && (
         <div className='mini-banner'
         style={{ borderRadius:'12px', width:'60%', display:'block', margin:'auto', marginBottom:'25px'}}>
        <img
          src={'http://via.placeholder.com/1500x540/50D3C9/FFFFFF?text=Banner%20empresa'}
          style={{
            width: '100%',
            border:'15px solid white', borderRadius:'15px'
            // height:'50vh'
          }}
        />  
      </div>
       )}
       <Row>
      {companiesEvent.length > 0 && config.visualization==='stand' &&
        companiesEvent.map(
          (company, index) =>
            company.visible && (
            
             <Col key={index}span={8} >
            <FeriaStand
              image={
                company.list_image === ''
                  ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Logo' // imagen por defecto si no encuentra una imagen guardada
                  : company.list_image
              }
              eventId={event_id}
              name={company.name}
            />
            </Col> 
           
            ))} </Row>
      {companiesEvent.length == 0 && <Empty />}
    </div>
  );
};
const mapDispatchToProps = {
  setVirtualConference,
  setTopBanner
};
export default  connect(null,mapDispatchToProps)(FeriasList) ;
