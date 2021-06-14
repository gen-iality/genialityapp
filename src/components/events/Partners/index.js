import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import useGetEventCompanies from '../../empresas/customHooks/useGetEventCompanies';
import PartnersList from '../PartnersList';
import PartnersDetail from '../PartnersDetail';

export default function Partners({ event }) {
  const [companies, loadingCompanies] = useGetEventCompanies(event._id || null);
  const [viewPartnerDetail, setViewPartnerDetail] = useState(false);
  const [partnerDetailSelected, setPartnerDetailSelected] = useState({});

  const handleOpenPartnerDetail = (parnertId) => {
    setViewPartnerDetail(true);
    setPartnerDetailSelected(companies[parnertId]);
  };

  const handleClosePartnerDetail = () => {
    setViewPartnerDetail(false);
    setPartnerDetailSelected({});
  };

  useEffect(() => {
    setViewPartnerDetail(false);
    setPartnerDetailSelected({});
  }, []);

  return (
    <Card title='Partners'>
      {viewPartnerDetail ? (
        <PartnersDetail company={partnerDetailSelected} handleClosePartnerDetail={handleClosePartnerDetail} />
      ) : (
        <PartnersList
          companies={companies}
          loadingCompanies={loadingCompanies}
          handleOpenPartnerDetail={handleOpenPartnerDetail}
        />
      )}
    </Card>
  );
}
