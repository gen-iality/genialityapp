import { Button, Empty, message, Row, Table, Tag, Typography } from 'antd'
import { DragOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import Loading from '../loaders/loading'
import useGetEventCompanies from './customHooks/useGetEventCompanies'
import { useState } from 'react';
import { useEffect } from 'react';
import { firestore } from '../../helpers/firebase';

const { Title } = Typography
const tableLocale = {
  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay datos" />
}

function Empresas({ event, match }) {
  const [companies, loadingCompanies] = useGetEventCompanies(event._id)
  const [companyList, setCompanyList]=useState([])

  useEffect(()=>{
    
    if(companies.length>0 && companyList.length==0){
      let newCompanies=companies.map((company,ind)=>{       
        return {...company,index: company.index? company.index: ind+1} 
        })
      
        newCompanies= newCompanies.sort(function(a, b) {
         return a.index-b.index;
        });
     
        setCompanyList(newCompanies)
    }  
  },[companies])

 
  const SortableItem = sortableElement(props => <tr {...props} />);
  const SortableContainer = sortableContainer(props => <tbody {...props} />);
  const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const orderCompany=async()=>{
    message.loading("Por favor espere..")
    for(let i=0;i<companyList.length;i++){
      companyList[i].index=i+1;     
      var {id , ...company} =  companyList[i];
      await firestore
          .collection('event_companies')
          .doc(event._id)
          .collection('companies').doc(companyList[i].id).set({
            ...company
          },{merge: true})
    }    
    message.success('Orden guardado correctamente..');
    
  }

  const companyColumns = useMemo(() => {
    return [
      {
        title: '',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render(companyName, record)   { return <DragHandle />}
      },
      {
        title: 'Nombre',
        dataIndex: 'name',
        render(companyName, record) {
          return (
            <Link
              to={`${match.url}/editar/${record.id}`}
              title="Editar"
            >
              {companyName}
            </Link>
          )
        }
      },
      {
        title: 'Tipo de stand',
        dataIndex: 'stand_type'
      },
      {
        title: 'Visible',
        dataIndex: 'visible',
        render(visible) {
          return visible
            ? <Tag color="green">{'Visible'}</Tag>
            : <Tag color="red">{'Oculto'}</Tag>
        }
      },
      {
        title: '',
        dataIndex: 'eliminar',
        render(visible) {
          return <Button>Eliminar</Button>
            
        }
      },
    ]
  }, [match.url])

  if (loadingCompanies) {
    return <Loading />
  }

 

 const onSortEnd = ({ oldIndex, newIndex }) => {
    
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(companyList), oldIndex, newIndex).filter(el => !!el);
      console.log('Sorted items: ', newData);
      for(let i=0;i<newData .length;i++){
        newData [i].index=i;  
      }
      setCompanyList(newData)
       
    }
  };

  const DraggableContainer = props => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = companyList.findIndex(x => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <div>
      <Title level={4}>{'Empresas'}</Title>

      <Row justify="end" style={{ marginBottom: '10px' }}>     
        <Link to={`${match.url}/crear`}>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            {'Crear empresa'}
          </Button>
        </Link>
        <Link style={{marginLeft:20}} to={`${match.url}/Stands`}>
          <Button type="primary" icon={<PlusCircleOutlined />}>
            {'Gestionar stands'}
          </Button>
        </Link>
        <Button onClick={()=>orderCompany()} style={{marginLeft:20}} type="primary" icon={<SaveOutlined />}>
            {'Guardar orden'}
          </Button>
      </Row>

      <Table
        locale={tableLocale}
        dataSource={companyList}
        columns={companyColumns}
        pagination={false}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </div>
  )
}

export default Empresas
