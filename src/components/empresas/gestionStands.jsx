import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Row,Form,Modal,Col, Divider, Space, Card, message} from 'antd';

//import Form from 'antd/lib/form/Form';
//import Modal from 'antd/lib/modal/Modal';
import React, { useMemo, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';

import useGetEventCompaniesStandTypesOptions from './customHooks/useGetEventCompaniesStandTypesOptions';
import { Select } from 'antd';

const { Option } = Select;


const Stands=(props)=>{
    const [standTypesOptions, loadingStandTypes] = useGetEventCompaniesStandTypesOptions(props.event._id);
    const[standsList,setStands]=useState()
    const[editStands,setEditStands]=useState(false)
    const[selectedStand,setSelectedStand]=useState(null)
    const[nameStand,setNameStand]=useState(null)
    const[documentEmpresa, setDocumentEmpresa]=useState(null)
    const [visualization,setVisualization]=useState('list');
    const [config,setconfig]=useState(null)


    function handleChange(value) {
      console.log(`selected ${value}`);
      setVisualization(value)
    }

   async function obtenerConfig(){
     let config= await firestore
          .collection('event_companies')
          .doc(props.event._id).get();
          console.log(config.data())
          setconfig(config.data())
        if(config.data().config){
          setVisualization(config.data().config.visualization)
        }
    }

    async function saveConfiguration(){
      message.loading("Por favor espere...")
      let config= await firestore
      .collection('event_companies')
      .doc(props.event._id).set({
        config:  {visualization:visualization}
      },{merge:true})
      message.success("Configuración guardada correctamente")
    } 
    
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
          
        if(record!=null){
          setSelectedStand(record)
          setNameStand(record.value)
        } else{
          setNameStand(null)
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
        obtenerConfig();
      },[])

      useEffect(()=>{ 
         
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
            
          }); 
                 
        } 

      },[standTypesOptions])
      return(<div> 
        <Row style={{width:700, marginBottom:20}}> <Link to={`/event/${props.event._id}/empresas`}><ArrowLeftOutlined /></Link> <div style={{marginLeft:30}}>Configuración</div>
         </Row>
     

        <Space direction="vertical" style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
          <Card style={{width:700}} title="Configuración general" >
              <Row>
            <span>Visualización: </span> 
            <Select value={visualization} style={{ width: 220,marginLeft:30 }} onChange={handleChange}>
              <Option value="list">Listado</Option>
              <Option value="stand">Stand</Option>         
            </Select>
            <Button style={{marginLeft:35}} onClick={()=>saveConfiguration()} type="primary" icon={<SaveOutlined />}>
            {'Guardar'}
          </Button>
            </Row>
          </Card>
          <Card style={{width:700}} title="Configuración de stands" 
          extra={
            <Button onClick={()=>{setEditStands(true);obtenerStand(null)}} type="primary" icon={<PlusCircleOutlined />}>
            {'Agregar stand'}
          </Button>}>
          <div style={{width:700}}>
          
        <Row justify='space-between' ><Col span={6}>Nombre</Col><Col span={6}>Valor</Col><Col span={6}>Opciones</Col></Row>
        <Row style={{width:660}}>
        <Divider></Divider>
        </Row>
         {standsList && standsList.map((stand,index)=>(<Row style={{borderBottom:'1px solid light-gray',marginBottom:'2px'}} key={'rowstand-'+index} justify='space-between'>
           <Col span={6} key={'stand-'+index}> {stand.label}</Col>
           <Col span={6} key={'standv-'+index}> {stand.value}</Col> 
           <Col style={{marginBottom:3}} span={6} key={'buttons-'+index}> 
           <Button style={{marginRight:3}} size='small' onClick={()=>{setEditStands(true);obtenerStand(stand)}}><EditOutlined /></Button>
           <Button onClick={()=>{deleteStand(index)}} size='small'><DeleteOutlined /></Button></Col> 
           </Row> ))}
           </div>     
           
        <Modal title="Editar stand" visible={editStands} onOk={editStand}  onCancel={handleCancel}>
          <Form>
        <Form.Item label="Nombre">
          <Input value={nameStand && nameStand} onChange={(e) => HandlerEditText(e)}/>
        </Form.Item>             
        </Form>
      </Modal>
      </Card>
      </Space>
        
     
    </div>)
}

export default Stands;