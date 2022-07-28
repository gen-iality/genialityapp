import { CurrentEventContext } from '@/context/eventContext';
import { Row } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { renderTypeComponent } from '../hooks/functions';
import { obtenerDescriptionSections } from '../hooks/utils';

export const RenderSectios = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  //CONTEXTO
  const cEvent = useContext(CurrentEventContext);
  //PERMITE OBTENER LAS SECCIONES DE LA DESCRIPCION
  useEffect(() => {
    if (!cEvent.value) return;
    obtenerDescriptionSections(setLoading, cEvent, setDataSource);
  }, [cEvent.value]);
  return (
    <Row gutter={[16, 16]}>
      {dataSource.map((section) => {
        return renderTypeComponent(section.type, section.value);
      })}
    </Row>
  );
};
