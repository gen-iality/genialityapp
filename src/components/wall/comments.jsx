import React, { Component } from 'react';
import { firestore } from '../../helpers/firebase';
import { Avatar, List, Card, Spin, Row, Comment, Tooltip, Typography, Divider } from 'antd';
import Moment from 'moment';
import withContext from '../../Context/withContext';

class CommentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481',
      dataComment: undefined,
      postId: this.props.postId,
      eventId: this.props.eventId,
      commentsCount: this.props.commentsCount || 0,
    };
  }
  async getDataUser(iduser){     
    let user=await firestore.collection(`${this.props.eventId}_event_attendees`).where("account_id","==",iduser).get();  
    if(user.docs.length>0 && this.props.cEvent.value.user_properties){
      let fieldAvatar=this.props.cEvent.value.user_properties.filter((field)=>field.type=="avatar")
      if(fieldAvatar.length>0){        
        return user.docs[0].data().user?.picture;
      }     
    }
    return undefined;
  }
  // se obtienen los comentarios, Se realiza la muestra del modal y se envian los datos a dataComment del state
  async getComments(postId, eventId) {
    try {
      let dataComment = [];

      let admincommentsRef = firestore
        .collection('adminPost')
        .doc(eventId)
        .collection('comment')
        .doc(postId)
        .collection('comments')
        .orderBy('date', 'desc'); 

      let snapshot = await admincommentsRef.get();      

      dataComment = await  Promise.all(snapshot.docs.map(async(doc) => {       
        let picture= await this.getDataUser(doc.data().author)
        return { id: doc.id, ...doc.data(),picture:picture };
      }));   
      this.setState({ dataComment });
    } catch (err) {
      this.setState({ dataComment: [] });
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.commentsCount !== this.props.commentsCount) {
      this.getComments(this.props.postId, this.props.eventId);
    }
  }

  async componentDidMount() {
    this.getComments(this.props.postId, this.props.eventId);
  }

  render() {
    const { dataComment } = this.state;
   
    return (
      <div style={{ textAlign: 'left' }}>
        {!dataComment && <Spin tip='Loading...' />}

        {dataComment && dataComment.length === 0 && (
          <Card style={{ display: 'block', margin: '0 auto', textAlign: 'left', padding: '0px 30px' }}>
            Aún sin comentarios
          </Card>
        )}

        {dataComment && dataComment.length > 0 && (
          <List
            itemLayout='vertical'
            // Aqui se llama al array del state
            dataSource={dataComment}
            // Aqui se mapea al array del state
            renderItem={(item) =>            
              (
              <List.Item key={item.id}>                
                <Comment
                  avatar={                   
                    item.authorName ? (                      
                      <Avatar src={ item.picture?item.picture:null}>
                        {!item.picture && item.authorName &&
                          item.authorName.charAt(0).toUpperCase() + item.authorName.charAt(1).toLowerCase()}
                      </Avatar>
                    ) : (
                      <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
                    )
                  }
                  author={<Typography.Paragraph style={{fontSize:'14px'}}>{item.authorName}</Typography.Paragraph>}
                  datetime={
                    <Tooltip title={Moment(new Date(item.date.toMillis())).format('YYYY-MM-DD HH:mm:ss')}>
                      {/* <span>{Moment(new Date(item.date.toMillis())).format('YYYY-MM-DD')}</span> */}
                      <span>{Moment(Moment(new Date(item.date.toMillis()))).from(Moment(new Date()))}</span>
                    </Tooltip>
                  }
                  content={item.comment}
                />
              </List.Item>

              // <List.Item style={{marginBottom:20,marginTop:10, border:'1px solid #f6f6f6', borderRadius:"5px"}} key={item.id}>
              //   <List.Item.Meta
              //     avatar={
              //       item.authorName ? (
              //         <Avatar>
              //           {item.authorName &&
              //             item.authorName.charAt(0).toUpperCase() + item.authorName.charAt(1).toLowerCase()}
              //         </Avatar>
              //       ) : (
              //         <Avatar src='https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' />
              //       )
              //     }
              //     title={
              //       <Row justify='space-between'>
              //         <span>{item.authorName}</span>{' '}
              //         <small>{Moment(new Date(item.date.toMillis())).format('YYYY-MM-DD HH:mm:ss')} </small>{' '}
              //       </Row>
              //     }
              //     description={item.comment}
              //   />
              // </List.Item>
            )}
          />
        )}
      </div>
    );
  }
}
export default withContext(CommentsList);
