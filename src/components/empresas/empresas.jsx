import { Button, Empty, message, Row, Table, Tag, Typography } from 'antd'
import { DragOutlined, PlusCircleOutlined, SaveOutlined, SettingOutlined } from '@ant-design/icons'
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
    
    if(companies.length>0){
      let newCompanies=companies.map((company,ind)=>{       
        return {...company,index: company.index? company.index: ind+1} 
        })
      
        newCompanies= newCompanies.sort(function(a, b) {
         return a.index-b.index;
        });
       console.log("EJECUTADO EFECCCCT")
        setCompanyList(newCompanies)
    }  
  },[companies])

 
  const SortableItem = sortableElement(props => <tr {...props} />);
  const SortableContainer = sortableContainer(props => <tbody {...props} />);
  const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);

  const orderCompany=async(updateList)=>{
    message.loading("Por favor espere..")
    console.log(companyList)
    let companies=updateList?updateList:companyList
    for(let i=0;i<companies.length;i++){
      companies[i].index=i+1;     
      var {id , ...company} =  companies[i];
      await firestore
          .collection('event_companies')
          .doc(event._id)
          .collection('companies').doc(companies[i].id).set({
            ...company
          },{merge: true})
    }    
    message.success('Orden guardado correctamente..');
    
  }

  function deleteCompany(id){
    console.log(event._id)
    firestore
      .collection('event_companies')
      .doc(event._id)
      .collection('companies').doc(id).delete().then((resp)=>{
            
        let updateList= companyList.filter(company=>company.id!==id);     
      setCompanyList(updateList);
         orderCompany(updateList).then((r)=>{
           console.log("TERMINO DE ACTUALIZAR INDEX=>")
         })
      });
  
 }


 let companyColumns = [
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
        dataIndex: 'id',
        render(value,record) {
          return <Button onClick={()=>deleteCompany(value)}>Eliminar</Button>
            
        }
      },
    ]
  

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
        <Link style={{marginLeft:20}} to={`${match.url}/configuration`}>
          <Button type="primary" icon={<SettingOutlined />}>
            {'Configuración'}
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
