import React, { Component, Fragment } from 'react';
import { Avatar, Button, message, List, Card, Spin, Alert, Popconfirm, Space, Typography, Image, Tooltip } from 'antd';
import TimeStamp from 'react-timestamp';
import { MessageOutlined, LikeOutlined, DeleteOutlined, LikeFilled } from '@ant-design/icons';
import CommentEditor from './commentEditor';
import Comments from './comments';
import '../../styles/landing/_wall.scss';
import { saveFirebase } from './helpers';
import withContext from '../../Context/withContext';
import Moment from 'moment';
import { firestore } from '../../helpers/firebase';
import { WallContextProvider } from '../../Context/WallContext';

const IconText = ({ icon, text, onSubmit, color, megusta }) => (
  <Button htmlType='submit' type='text' onClick={onSubmit} style={{ color: megusta == 1 ? color : 'gray' }}>
    {React.createElement(icon, { style: { marginRight: '2px', fontSize: '20px' } })}
    {text}
  </Button>
);

class WallList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481',
      dataPost: [],
      dataComment: [],
      dataPostFilter: [],
      value: '',
      valueCommit: '',
      currentCommet: null,
      deleting: false,
      user: undefined,
      commenting: null,
      displayedComments: {},
      event: this.props.cEvent.value || {},     
    };
    
  }

  innerCreateComment = async (post, comment) => {
    await this.setState({ commenting: post.id });
    await this.setState({ commenting: null });
    message.success('Comentario creado.');    
    const dataPost = await saveFirebase.createComment(post.id, this.props.cEvent.value._id, comment, this.props.cUser.value);
   // this.setState({ dataPost });
    this.innershowComments(post.id, post.comments + 1);
  }; 

  innershowComments = async (postId, commentsCount) => {
    let newdisplayedComments = { ...this.state.displayedComments };
    this.state.displayedComments[postId]
    //Mostramos los comentarios
    if (!this.state.displayedComments[postId]) {
      let content = (
        <div>
          <Comments postId={postId} commentsCount={commentsCount} eventId={this.state.event._id} />
        </div>
      );
      newdisplayedComments[postId] = content;

      //Ocultamos los comentarios
    } else {
      delete newdisplayedComments[postId];
    }

    this.setState({ displayedComments: newdisplayedComments });
  };

  innerDeletePost = async (postId) => {
    await this.setState({ deleting: postId });
    let eventId = this.state.event._id;
    const dataPostOld = this.state.dataPost;
    await saveFirebase.deletePost(postId, eventId);
    await this.setState({ deleting: null });
    message.success('Publicación eliminada.');
    const dataPost = dataPostOld.filter((item) => item.id !== postId); //crea un nuevo array de objetos sin el post eliminado
    this.setState({ dataPost }); // asigan el nuevo array al estado para que se actualice el componente
  };

  componentDidMount() {
    this.getPosts();
  }
  async getDataUser(iduser){     
    let user=await firestore.collection(`${this.props.cEvent.value._id}_event_attendees`).where("account_id","==",iduser).get();  
    if(user.docs.length>0 && this.props.cEvent.value.user_properties){
      let fieldAvatar=this.props.cEvent.value?.user_properties.filter((field)=>field.type=="avatar")
      if(fieldAvatar.length>0){        
        return user.docs[0].data().user?.picture;
      }     
    }
    return undefined;
  }

  //Se obtienen los post para mapear los datos, no esta en ./helpers por motivo de que la promesa que retorna firebase no se logra pasar por return
  getPosts() {

    try {
      let adminPostRef = firestore
        .collection('adminPost')
        .doc(this.props.cEvent.value._id)
        .collection('posts')
        .orderBy('datePost', 'desc');
      adminPostRef.onSnapshot(async(snapshot) => {
        let dataPost = [];

        if (snapshot.empty) {
          this.setState({ dataPost: dataPost });
        }
   
       dataPost= await Promise.all(snapshot.docs.map(async(doc) => {
          var data = doc.data();                     
            let picture= await this.getDataUser(doc.data().author)
            return {...doc.data(), id: doc.id ,picture:picture };      
        }));
        
        this.setState({ dataPost: dataPost });
      });
    } catch (e) {
      console.log(e);
    }
  }
  componentDidUpdate(prevProps,prevState) {
    if (prevState.dataPost !== this.state.dataPost) {
      this.setState({ dataPost: this.state.dataPost });
    }
  }

  gotoCommentList() {
    this.setState({ currentCommet: null });
  }

  render(){
    const { dataPost } = this.state;
    return (
      <Fragment>
        <div>
          {!dataPost && <Spin size='large' tip='Cargando...' />}

          {dataPost && dataPost.length === 0 && (
            <Alert
              message='Listos para la primera publicación'
              description='Aún esta el lienzo el blanco para crear la primera publicación, aprovecha'
              type='info'
              showIcon
            />
          )}

          {dataPost && dataPost.length > 0 && (
            <WallContextProvider>          
              <List
                itemLayout='vertical'
                size='small'
                style={{ texteAling: 'left', marginBottom: '20px' }}
                // Aqui se llama al array del state
                dataSource={dataPost}
                // Aqui se mapea al array del state
                renderItem={(item) => (
                  <Card
                    style={{ marginBottom: '20px' }}
                    actions={[
                     this.props.cEventUser.value!==null && <CommentEditor
                        key={`comment-${item.id}`}
                        item={item}                        
                        onSubmit={(comment) => {                                               
                          this.innerCreateComment(item, comment);
                         
                        }}
                        user={this.props.cUser}
                      />
                    ]}>
                    <List.Item
                      key={item.id}
                      style={{ padding: '5px' }}
                      actions={[
                        <Space key='opciones' wrap>
                         { this.props.cUser.value!==null && <IconText
                            icon={
                              item.usersLikes?.find((itm) => itm == this.props.cUser.value._id) != undefined
                                ? LikeFilled
                                : LikeOutlined
                            }
                            text={(item.likes || 0) + ' Me gusta'}
                            key='list-vertical-like-o'
                            color={
                              item.usersLikes?.find((itm) => itm == this.props.cUser.value._id) != undefined
                                ? '#518BFB'
                                : 'gray'
                            }
                            megusta='1'
                            onSubmit={() => {
                              this.props.increaseLikes(item.id, this.props.cUser.value._id);
                            }}
                          />}
                          <IconText
                            icon={MessageOutlined}
                            text={(item.comments || 0) + (item.comments === 1 ? ' Comentario' : ' Comentarios')}
                            key='list-vertical-message'
                            onSubmit={() => {
                              this.innershowComments(item.id, item.comments);
                            }}
                          />
                          <>
                            {this.props.cUser.value && this.props.cUser.value._id.trim() === item.author.trim() && (
                              <>
                                <Popconfirm
                                  title='Seguro deseas eliminar esta publicacion?'
                                  onConfirm={() => this.innerDeletePost(item.id)}
                                  okText='Eliminar'
                                  okType='danger'
                                  cancelText='Cancelar'>
                                  <Button
                                    key='list-vertical-message'
                                    type='text'
                                    danger
                                    icon={<DeleteOutlined style={{ marginRight: '2px', fontSize: '20px' }} />}>
                                    Eliminar mi publicación
                                  </Button>
                                </Popconfirm>
                                {this.state.deleting === item.id && <Spin />}
                              </>
                            )}
                          </>
                        </Space>,
                      ]}>
                      <List.Item.Meta
                        avatar={
                          item.authorImage ? (
                            <Avatar src={item.picture?item.picture:null} size={50} />
                          ) : (
                            <Avatar size={50}>
                              {item.authorName &&
                                item.authorName.charAt(0).toUpperCase() + item.authorName.charAt(1).toLowerCase()}
                            </Avatar>
                          )
                        }
                        title={<span >{item.authorName}</span>}
                        description={
                          <div style={{marginTop:'-10px'}}>
                          <Tooltip
                            title={Moment(new Date(item.datePost.toMillis())).format('YYYY-MM-DD HH:mm:ss')}>
                            {/* <TimeStamp date={item.datePost.seconds} /> */}
                            <span>{Moment(Moment(new Date(item.datePost.toMillis()))).from(Moment(new Date()))}</span>
                          </Tooltip>
                          </div>
                        }
                      />

                      <Typography.Paragraph>{item.post}</Typography.Paragraph>

                      {item.urlImage && (
                        <Image
                          width={'100%'}
                          // height={'400px'}
                          style={{
                            display: 'block',
                            margin: '0 auto',
                            objectFit: 'cover',
                          }}
                          alt='logo'
                          src={item.urlImage}
                          preview={{ mask: <span>Ver la imagen completa</span> }}
                        />
                      )}
                    </List.Item>
                    {this.state.displayedComments[item.id]}
                    {/* <CommentEditor
                      onSubmit={(comment) => {
                        this.innerCreateComment(item, comment);
                      }}
                      user={this.props.cUser}
                    /> */}
                  </Card>
                )}
              />
            </WallContextProvider>
          )}
        </div>
      </Fragment>
    );
  }
}

let WallListwithContext = withContext(WallList);
export default WallListwithContext;
