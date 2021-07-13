import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Row,Form,Modal,Col, Divider} from 'antd';

//import Form from 'antd/lib/form/Form';
//import Modal from 'antd/lib/modal/Modal';
import React, { useMemo, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';

import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions';


const Stands=(props)=>{
    const [standTypesOptions, loadingStandTypes] = useGetEventCompaniesStandTypesOptions(props.event._id);
    const[standsList,setStands]=useState()
    const[editStands,setEditStands]=useState(false)
    const[selectedStand,setSelectedStand]=useState(null)
    const[nameStand,setNameStand]=useState(null)
    const[documentEmpresa, setDocumentEmpresa]=useState(null)
  
    
      const editStand=async ()=>{
        
         let list=standsList
         let selectedStandEdit=selectedStand!=null?{...selectedStand, label:nameStand,value:nameStand}: {label:nameStand,value:nameStand,id:standsList.length}       
         selectedStand!=null? list[selectedStand.id]=selectedStandEdit:list.push(selectedStandEdit);             
        let modifyObject={...documentEmpresa,stand_types:list}
        await actualizarData(modifyObject)
         setStands(list)
         handleCancel()         
      }

    async function actualizarData(data){
      await firestore
          .collection('event_companies')
          .doc(props.event._id)
          .set(data);        
    }

    async function deleteStand(id){
      let list=standsList
      list=list.filter((stand)=>stand.id!==id);
      console.log(list)
      let modifyObject={...documentEmpresa,stand_types:list}
      await actualizarData(modifyObject)
      setStands(list)
    }

      function obtenerStand(record){
          
        if(record){
          setSelectedStand(record)
          setNameStand(record.value)
        }     
      }
     const HandlerEditText= (e) => {
        const value = e.target.value;   
        setNameStand(value)
     }
      const handleCancel = () => {
        setEditStands(false);
      }
      

      useEffect(()=>{ 
        console.log("STANDS ACA")
        console.log(standTypesOptions)    
        if(standTypesOptions){
          let listStands=[]
          standTypesOptions.map((stands,indx)=>{
            listStands.push({...stands,id:indx})
          })
          firestore
          .collection('event_companies')
          .doc(props.event._id)
          .get().then((resp)=>{
            setStands(listStands)    
            setDocumentEmpresa(resp.data())                   
            console.log("MODIFICO")
          }); 
                 
        }       

      },[standTypesOptions])
      return(<div>        
        <Modal title="Editar stand" visible={editStands} onOk={editStand}  onCancel={handleCancel}>
          <Form>
        <Form.Item label="Nombre">
          <Input value={nameStand && nameStand} onChange={(e) => HandlerEditText(e)}/>
        </Form.Item>             
        </Form>
      </Modal>

        <Row style={{width:700, marginBottom:20}}> <Link to={`/event/${props.event._id}/empresas`}><ArrowLeftOutlined /></Link> <div style={{marginLeft:30}}>Stands</div>
         </Row>
        <Row style={{width:700, marginBottom:20}} justify='end'>
        <Button onClick={()=>{setEditStands(true);obtenerStand(null)}} type="primary" icon={<PlusCircleOutlined />}>
            {'Agregar stand'}
          </Button>
        </Row>
        <div style={{width:700}}>
        <Row justify='space-between' ><Col span={6}>Nombre</Col><Col span={6}>Valor</Col><Col span={6}>Opciones</Col></Row>
      <Divider></Divider>
         {standsList && standsList.map((stand,index)=>(<Row style={{borderBottom:'1px solid light-gray',marginBottom:'2px'}} key={'rowstand-'+index} justify='space-between'>
           <Col span={6} key={'stand-'+index}> {stand.label}</Col>
           <Col span={6} key={'standv-'+index}> {stand.value}</Col> 
           <Col style={{marginBottom:3}} span={6} key={'buttons-'+index}> 
           <Button style={{marginRight:3}} size='small' onClick={()=>{setEditStands(true);obtenerStand(stand)}}><EditOutlined /></Button>
           <Button onClick={()=>{deleteStand(index)}} size='small'><DeleteOutlined /></Button></Col> 
           </Row> ))}
           </div>
    </div>)
}

export default Stands;