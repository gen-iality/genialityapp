import React, { useEffect } from 'react';
import { Row } from 'antd';
import TicketsForm from '../../tickets/formTicket';
import { connect } from 'react-redux';
import { UseUserEvent } from '../../../Context/eventUserContext';
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions';
import { Redirect } from 'react-router-dom';

const PageNotPermissions = (props) => {
  let EventUser = UseUserEvent();
  let redirect;

  useEffect(() => {
    EventUser.value == null && props.setSectionPermissions({ view: true, section: props.sectionPermissions.section });
    if (EventUser.value !== null && props.sectionPermissions.section) {
      redirect = props.sectionPermissions.section && props.sectionPermissions.section.toLowerCase();
    } else {
      redirect = null;
    }
  }, []);

  return (
    <>
      {' '}
      {redirect != null && <Redirect to={redirect} />}
      <Row justify='center' style={{ margin: 10, background: 'white' }}>
        {props.sectionPermissions.view && (
          <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>
            {props.sectionPermissions.section ? (
              <>
                Para poder ver la seccion <a style={{ color: '#FF3830' }}>{props.sectionPermissions.section}</a> tienes
                que estar registrado en este evento
              </>
            ) : (
              <>Para poder ver esta seccion tienes que estar registrado en este evento</>
            )}
          </h1>
        )}
        {!props.sectionPermissions.ticketview && <TicketsForm />}
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(PageNotPermissions);
