import { Component } from 'react'
import { Row, Col } from 'antd'
import CreatePost from './createPost'
import ListWall from './listWall'

import { saveFirebase } from './helpers'
import withContext from '@context/withContext'
import { setVirtualConference } from '../../redux/virtualconference/actions'
import { connect } from 'react-redux'

class Wall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataPost: undefined,
      user: undefined,
    }
  }

  componentDidMount() {
    this.props.setVirtualConference(false)
    if (this.props.cEventUser.value) {
      this.setState({ user: this.props.cEventUser.value })
    }
  }

  componentWillUnmount() {
    this.props.setVirtualConference(true)
  }

  // addPosts = (post) => {
  //   this.setState({ dataPost: [post, ...this.state.dataPost] });
  // };

  deletePost = async (postId) => {
    //se borra en el API
    await saveFirebase.deletePost(postId, this.props.cEvent.value._id)

    //se borra local
    const updatedPost = this.state.dataPost.filter(function (value) {
      return value.id !== postId
    })
    return true
  }

  increaseLikes = async (postId, userId) => {
    const updatedPost = await saveFirebase.increaseLikes(
      postId,
      this.props.cEvent.value._id,
      userId,
    )
    //se actualiza local
    /* updatedPost = this.state.dataPost.map(function(value) {
      return value.id !== postId ? value : updatedPost;
    });
   // this.setState({ dataPost: updatedPost });
    return true;*/
  }
  createComment = async (postId, message) => {
    let updatedPost = await saveFirebase.createComment(
      postId,
      this.props.cEvent.value._id,
      message,
      this.state.user._id,
      this.state.user.names,
    )
    //se actualiza local
    updatedPost = this.state.dataPost.map(function (value) {
      return value.id !== postId ? value : updatedPost
    })
    return true
  }

  render() {
    const { currentCommet } = this.state
    return (
      <div>
        {/*Crear un nuevo post*/}
        {!currentCommet && (
          <div>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
              }}
            >
              <Col xs={24} sm={20} md={20} lg={20} xl={12}>
                <CreatePost event={event} addPosts={this.addPosts} />
                <ListWall
                  createComment={this.createComment}
                  key={this.state.keyList}
                  deletePost={this.deletePost}
                  increaseLikes={this.increaseLikes}
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = {
  setVirtualConference,
}

const WallWithContext = withContext(Wall)
export default connect(null, mapDispatchToProps)(WallWithContext)
