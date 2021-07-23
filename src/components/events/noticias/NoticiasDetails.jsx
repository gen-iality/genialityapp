import React,{ useEffect } from 'react';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import withContext from '../../../Context/withContext';
import { withRouter } from 'react-router';
import { useState } from 'react';
import { NewsFeed } from '../../../helpers/request';
import { Card, Row, Spin,Col, Space } from 'antd';
import Meta from 'antd/lib/card/Meta';


const imgNotFound='data:image/png;base64,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';
const NoticiasDetails=({setVirtualConference, match})=>{
    const [eventId,setEventId]=useState()
    const [loading,setLoading]=useState(true)
    const [noticia,setNoticia]=useState()

    useEffect(()=>{
        setVirtualConference(false);
        console.log(match.params.event_id,match.params.id)
        NewsFeed.getOne(match.params.event_id,match.params.id).then((resp)=>{            
            if(resp){
                console.log(resp)
               setNoticia(resp)
               setLoading(false)
               setEventId(match.params.event_id)
            }
        });      
         
        

        return ()=>{
         setVirtualConference(true);
        }
    },[])

    return (
        <>  
           {loading && <Spin/>}
           {noticia && 
           <Col style={{padding:'30px 100px'}}>
                  <Card
                  title={noticia && noticia.title} 
                  extra={noticia && noticia.time}                   
                  cover={<img style={{height:'55vh', objectFit:'cover'}} alt="imagen noticia" src={noticia && noticia.image?noticia.image[0]:imgNotFound} />}>
                <div>
                  <Space direction='vertical' style={{width:'100%'}}>
                      <h2 style={{fontSize:'22px', marginBottom:'0px'}}>{noticia && noticia.description_short}</h2>
                      <p style={{color:'#9e9e9e'}}>{noticia && noticia.description_complete}</p>
                  </Space>
                </div>
                <iframe style={{height:'500px'}} width="100%" height="auto" src="https://www.youtube.com/embed/a1oXvugkgPs" title="YouTube video player" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ></iframe>
                    {/* <Meta title={noticia && noticia.description_short} description={noticia && noticia.description_complete} /> */}
                    <Row style={{marginTop:30}} justify={'end'}>Actualizado: {noticia && noticia.updated_at}</Row>
                </Card>
            </Col>}
        </>
        );
}
const mapDispatchToProps = {
    setVirtualConference  
  };
let NoticiasDetailsConnect= connect(null,mapDispatchToProps)(withContext(withRouter(NoticiasDetails)));
export default NoticiasDetailsConnect;