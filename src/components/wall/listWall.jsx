import React, { Component, Fragment } from 'react';
import { Avatar, Button, message, List, Card, Spin, Alert, Popconfirm } from 'antd';
import TimeStamp from 'react-timestamp';
import { MessageOutlined, LikeOutlined, DeleteOutlined } from '@ant-design/icons';
import CommentEditor from './commentEditor';
import Comments from './comments';
import '../../styles/landing/_wall.scss';
import { saveFirebase } from './helpers';

const IconText = ({ icon, text, onSubmit }) => (
  <Button htmlType='submit' type='link' onClick={onSubmit} style={{ color: 'gray' }}>
    {React.createElement(icon, { style: { marginRight: 8, fontSize: '20px' } })}
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
      dataPost: this.props.dataPost || undefined,
      dataComment: [],
      dataPostFilter: [],
      value: '',
      valueCommit: '',
      currentCommet: null,
      deleting: false,
      user: undefined,
      commenting: null,
      displayedComments: {},
      event: this.props.event || {}
    };
  }

  innerCreateComment = async (post, comment) => {
    await this.setState({ commenting: post.id });
    await this.setState({ commenting: null });
    message.success('Comentario creado.');
    const dataPost = await saveFirebase.createComment(post.id, this.state.event._id, comment, this.state.user);
    this.setState({ dataPost });

    this.innershowComments(post.id, post.comments + 1);
  };

  innershowComments = async (postId, commentsCount) => {
    let newdisplayedComments = { ...this.state.displayedComments };

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

  componentDidUpdate(prevProps) {
    if (prevProps.dataPost !== this.props.dataPost) {
      this.setState({ dataPost: this.props.dataPost });
    }

    if (prevProps.user !== this.props.user) {
      this.setState({ user: this.props.user });
    }
  }

  async componentDidMount() {
    if (this.props.user) {
      const { user } = this.props;
      this.setState({ user });
    }
  }

  gotoCommentList() {
    this.setState({ currentCommet: null });
  }

  render() {
    const { dataPost, user, event } = this.state;

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
            <>
              <List
                itemLayout='vertical'
                size='small'
                style={{ texteAling: 'left', marginBottom: '20px' }}
                // Aqui se llama al array del state
                dataSource={dataPost}
                // Aqui se mapea al array del state
                renderItem={(item) => (
                  <Card style={{ marginBottom: '20px' }}>
                    <List.Item
                      key={item.id}
                      style={{ padding: '0px' }}
                      // Se importa el boton de like y el de redireccionamiento al detalle del post
                      actions={[
                        <IconText
                          icon={LikeOutlined}
                          text={(item.likes || 0) + ' Me gusta'}
                          key='list-vertical-like-o'
                          onSubmit={() => {
                            this.props.increaseLikes(item.id, event._id, user._id);
                          }}
                        />,
                        <IconText
                          icon={MessageOutlined}
                          text={(item.comments || 0) + (item.comments === 1 ? ' Comentario' : ' Comentarios')}
                          key='list-vertical-message'
                          onSubmit={() => {
                            this.innershowComments(item.id, item.comments);
                          }}
                        />,
                        <>
                          {user && (user._id === item.author || user.email === item.author) && (
                            <>
                              <Popconfirm
                                title='Seguro deseas eliminar este mensaje?'
                                onConfirm={() => this.innerDeletePost(item.id)}>
                                <Button key='list-vertical-message' shape='circle' icon={<DeleteOutlined />} />
                              </Popconfirm>
                              {this.state.deleting === item.id && <Spin />}
                            </>
                          )}
                        </>
                      ]}>
                      <List.Item.Meta
                        avatar={
                          item.avatar ? (
                            <Avatar src={item.avatar} />
                          ) : (
                            <Avatar>
                              {item.authorName &&
                                item.authorName.charAt(0).toUpperCase() + item.authorName.charAt(1).toLowerCase()}
                            </Avatar>
                          )
                        }
                        title={<span>{item.authorName}</span>}
                        description={
                          <span style={{ fontSize: '12px' }}>
                            <TimeStamp date={item.datePost.seconds} />
                          </span>
                        }
                      />

                      <br />
                      {item.post}
                      <br />
                      <br />
                      {item.urlImage && (
                        <img
                          width={'100%'}
                          style={{
                            display: 'block',
                            margin: '0 auto'
                          }}
                          alt='logo'
                          src={item.urlImage}
                        />
                      )}
                      <br />
                    </List.Item>
                    {this.state.displayedComments[item.id]}
                    <CommentEditor
                      onSubmit={(comment) => {
                        this.innerCreateComment(item, comment);
                      }}
                      user={user}
                    />
                  </Card>
                )}
              />
            </>
          )}
        </div>
      </Fragment>
    );
  }
}

export default WallList;
