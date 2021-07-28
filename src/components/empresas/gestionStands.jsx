import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Row,Form,Modal,Col, Divider, Space, Card, message} from 'antd';

//import Form from 'antd/lib/form/Form';
//import Modal from 'antd/lib/modal/Modal';
import React, { useMemo, useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../../helpers/firebase';
import { SketchPicker } from 'react-color';

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
    const [colorStand,setColorStand]=useState("toolbarDefaultBg")
    const [viewModalColor,setViewModalColor]=useState(false)
    const [noValid,setNoValid]=useState(false)


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
        if(nameStand!="" && nameStand!==null){        
         let list=standsList
         let selectedStandEdit=selectedStand!=null?{...selectedStand, label:nameStand,value:nameStand,color:colorStand}: {label:nameStand,value:nameStand,id:standsList.length,color:colorStand}       
         selectedStand!=null? list[selectedStand.id]=selectedStandEdit:list.push(selectedStandEdit);             
        let modifyObject={...documentEmpresa,stand_types:list}
        await actualizarData(modifyObject)
         setStands(list)
         handleCancel()  
        }else{
          setNoValid(true)
        }       
      }

    async function actualizarData(data){
      await firestore
          .collection('event_companies')
          .doc(props.event._id)
          .set(data);        
    }

    const handleClickSelectColor = () => {
      setViewModalColor(true)
    };

    async function deleteStand(id){
      let list=standsList
      list=list.filter((stand)=>stand.id!==id);
      console.log(list)
      let modifyObject={...documentEmpresa,stand_types:list}
      await actualizarData(modifyObject)
      setStands(list)
    }

      function obtenerStand(record){
          console.log(record)
        if(record!=null){
          if(record.color){
            setColorStand(record.color)
          }else{
            setColorStand("toolbarDefaultBg")
          }
          setSelectedStand(record)
          setNameStand(record.value)
        } else{
          setNameStand(null)
          setSelectedStand(null)
         
        }    
      }
     const HandlerEditText= (e) => {
        const value = e.target.value;         
        setNameStand(value);
        if(e.target.value.length>0){
          setNoValid(false)
        }
     }
      const handleCancel = () => {
        setEditStands(false);
        setNoValid(false)
      }
      useEffect(()=>{
        obtenerConfig();
      },[])

      useEffect(()=>{ 
         console.log(standTypesOptions)
        if(standTypesOptions){
          let listStands=[]
          standTypesOptions.map((stands,indx)=>{
            stands.label.label!==null&&listStands.push({...stands,id:indx})
          })
          console.log(listStands)
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
            <Button onClick={()=>{setEditStands(true);setColorStand("toolbarDefaultBg");setViewModalColor(false);setNoValid(false);obtenerStand(null)}} type="primary" icon={<PlusCircleOutlined />}>
            {'Agregar stand'}
          </Button>}>
          <div style={{width:700}}>
          
        <Row justify='space-between' ><Col span={6}>Nombre</Col><Col span={6}>Valor</Col><Col span={6}>Opciones</Col></Row>
        <Row style={{width:660}}>
        <Divider></Divider>
        </Row>
         {standsList&& standsList.map((stand,index)=>(<Row style={{borderBottom:'1px solid light-gray',marginBottom:'2px'}} key={'rowstand-'+index} justify='space-between'>
           <Col span={6} key={'stand-'+index}> {stand.label}</Col>
           <Col span={6} key={'standv-'+index}> {stand.value}</Col> 
           <Col style={{marginBottom:3}} span={6} key={'buttons-'+index}> 
           <Button style={{marginRight:3}} size='small' onClick={()=>{setEditStands(true); setViewModalColor(false); setNoValid(false);obtenerStand(stand)}}><EditOutlined /></Button>
           <Button onClick={()=>{deleteStand(index)}} size='small'><DeleteOutlined /></Button></Col> 
           </Row> ))}
           </div>     
           
        <Modal title={selectedStand?"Editar stand":"Agregar stand"} visible={editStands} onOk={editStand}  onCancel={handleCancel}>
          <Form>
        <Form.Item validateStatus={!noValid?'success':'error'} label={<span style={{width:70}}>Nombre</span>}>
          <Input value={nameStand && nameStand} onChange={(e) => HandlerEditText(e)}/> 
          {noValid && <small style={{color:'red'}}>Ingrese un nombre válido</small>   }      
        </Form.Item>
        <Form.Item label={<span style={{width:70}}>Color</span>}>        
              <div onClick={() => handleClickSelectColor()}>                 
                
                  <input
                    type='color'                    
                    style={{ marginRight: '3%', width: '8%',height:31,marginTop:1}}
                    value={colorStand}
                    disabled
                    onClick={()=>null}
                    onChange={null}
                  />
                  <button className='button'> {!selectedStand ? 'Seleccionar' : 'Escoger'}</button>
                </div>
              {viewModalColor&&  <div style={{ position: 'fixed', top: '270px', right: '0px', bottom: '0px', left: '600px',zIndex:10000 }}>
                    <Card size='small' style={{ width: '250px' }}>                     
                      <SketchPicker
                        color={colorStand}
                        onChangeComplete={(color) => {
                          console.log(color)
                         setColorStand(color.hex)
                        }}
                      />
                      <button style={{marginTop:20}} onClick={()=>setViewModalColor(false)} className='button'> Aceptar</button>
                    </Card>
                  </div>}
          </Form.Item>             
        </Form>
      </Modal>
      </Card>
      </Space>
        
     
    </div>)
}

export default Stands;