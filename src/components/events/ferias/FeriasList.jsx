import { Empty, Spin } from 'antd';
import React from 'react';
import Companylist from './companyList';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies';
import { useState } from 'react';

const FeriasList = ({ event_id, stateferia }) => {
  const [companies, loadingCompanies] = useGetEventCompanies(event_id);
  const [companiesEvent, setCompaniesEvent] = useState([]);

  useEffect(() => {
    if (!loadingCompanies) {
      console.log(companies);
      setCompaniesEvent(companies);
    }
  }, [loadingCompanies]);

  console.log(companiesEvent);

  return (
    <div>
      {loadingCompanies && <Spin size='small' />}

      {companiesEvent.length > 0 &&
        companiesEvent.map(
          (company, index) =>
            company.visible && (              
                <Companylist
                key={'companyList'+index}
                  img={
                    company.list_image === ''
                      ? 'https://via.placeholder.com/200/50D3C9/FFFFFF?text=Logo' // imagen por defecto si no encuentra una imagen guardada
                      : company.list_image
                  }
                  name={company.name}
                  position={company.position}
                  tel={company.advisor && company.telefono}
                  email={company.advisor && company.email}
                  description={company.short_description}
                  pagweb={company.webpage}
                />              
            )
        )}
      {companiesEvent.length == 0 && <Empty />}
    </div>
  );
};

export default FeriasList;
