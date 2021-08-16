import React from 'react';
import { Row } from 'antd';
import TicketsForm from '../../tickets/formTicket';
import { connect } from 'react-redux';

const PageNotPermissions = (props) => {
  return (
    <>
      {' '}
      <Row justify='center' style={{ margin: 10, background: 'white' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>
          Para poder ver la seccion <a style={{ color: '#FF3830' }}>{props.sectionPermissions.section}</a> tienes que
          estar registrado en este evento{' '}
        </h1>
        <TicketsForm />
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

export default connect(mapStateToProps, null)(PageNotPermissions);
