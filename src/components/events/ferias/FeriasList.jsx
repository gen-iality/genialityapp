import { Empty, Spin } from 'antd';
import React from 'react';
import Companylist from './companyList';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies';
import { useState } from 'react';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import { props } from 'ramda';

const FeriasList = ({ event_id,setVirtualConference }) => {
  const [companies, loadingCompanies] = useGetEventCompanies(event_id);
  const [companiesEvent, setCompaniesEvent] = useState([]);
  //EFECTO PARA OCULTAR Y MOSTRAR VIRTUAL CONFERENCE
  useEffect(()=>{
  setVirtualConference(false)
  return ()=>{
    setVirtualConference(true) 
  }
  },[])
  useEffect(() => {
    if (!loadingCompanies) {
      setCompaniesEvent(companies);
    }
  }, [loadingCompanies]);

  return (
    <div>
      {loadingCompanies && <Spin size='small' />}

      {companiesEvent.length > 0 &&
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
      {companiesEvent.length == 0 && <Empty />}
    </div>
  );
};
const mapDispatchToProps = {
  setVirtualConference
};
export default  connect(null,mapDispatchToProps)(FeriasList) ;
