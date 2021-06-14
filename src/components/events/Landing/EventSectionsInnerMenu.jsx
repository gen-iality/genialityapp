import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

const EventSectionsInnerMenu = ({ event }) => {
  console.log('carajo', event);
  let { url } = useRouteMatch();
  if (!event) return <h1>Cargando...</h1>;
  return (
    <>
      <h1>EVENTO: {event?._id}</h1>
      <ul>
        <li>
          <Link to={`${url}/documents`}>documents</Link>
        </li>
        <li>
          <Link to={`${url}/speakers`}>Speakers</Link>
        </li>
        <li>
          <Link to={`${url}/surveys`}>Surveys</Link>
        </li>
        <li>
          <Link to={`${url}/partners`}>Partners</Link>
        </li>
        <li>
          <Link to={`${url}/faqs`}>faqs</Link>
        </li>
        <li>
          <Link to={`${url}/certs`}>Certificates</Link>
        </li>
      </ul>
    </>
  );
};
export default EventSectionsInnerMenu;
