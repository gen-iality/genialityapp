import { CloseOutlined, HeartFilled, HeartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Card, Col, Drawer, Grid, Image, PageHeader, Row, Space, Typography } from 'antd';
import React, { useEffect } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import { Post } from '../../types';
import { isMobile } from 'react-device-detect';
import { UseUserEvent } from '@/context/eventUserContext';
import WindowCloseIcon from '@2fd/ant-design-icons/lib/WindowClose';
import PostDeleteModal from './PostDeleteModal';

const { useBreakpoint } = Grid;

interface Props {
  postSelected: Post;
  addLike: any;
  handleBack: any;
}

export default function PostDrawer(props: Props) {
  const { likes, likesListener, handleLike } = useSharePhoto();
  const { addLike, handleBack, postSelected } = props;
  const screens = useBreakpoint();
  const cUser = UseUserEvent();
  const userId = cUser.value._id;
  useEffect(() => {
    const unsubscribe = likesListener(postSelected.id);
    return () => {
      unsubscribe();
      // console.log('unmount');
    };
  }, []);

  const handleDeviceOrientation = () => {
    const deviceOrientation = window.screen.orientation.type;
    switch (deviceOrientation) {
      case 'landscape-primary':
      case 'landscape-secondary':
        return 'HORIZONTAL';
      case 'portrait-primary':
      case 'portrait-secondary':
        return 'VERTICAL';
      default:
        return 'VERTICAL';
    }
  };

  const iLikeIt = likes.filter((like) => {
    return like.id === userId;
  });

  return (
    <Drawer
      headerStyle={{ border: 'none' }}
      closable={false}
      bodyStyle={{ padding: '0' }}
      width={
        screens.xs && handleDeviceOrientation() === 'VERTICAL'
          ? '100vw'
          : !screens.lg && !screens.xl && handleDeviceOrientation() === 'HORIZONTAL'
          ? '60vw'
          : '35vw'
      }
      visible={postSelected ? true : false}
      onClose={() => handleBack()}
      title={
        <PageHeader
          style={{ padding: '0px 0px' }}
          avatar={{ icon: <UserOutlined />, src: postSelected.picture }}
          title={
            <Typography.Text type='secondary' style={{ fontSize: screens.xs ? '16px' : '18px' }}>
              {postSelected.user_name}
            </Typography.Text>
          }
          /* children={<Typography.Title level={4}>{postSelected.title}</Typography.Title>} */
        />
      }
      extra={
        <Space size='middle'>
          {cUser.value._id === postSelected.event_user_id && <PostDeleteModal postId={postSelected.id} />}
          {/* {<PostDeleteModal postId={postSelected.id} />} */}
          <Button
            size='large'
            shape='circle'
            type='text'
            icon={<WindowCloseIcon style={{ color: '#5B667A', fontSize: '25px' }} />}
            onClick={() => handleBack()}
          />
        </Space>
      }
      footerStyle={{ border: 'none' }}
      footer={
        <Space align='center'>
          <Space size={1}>
            <Button
              shape='circle'
              size='large'
              style={{ border: 'none' }}
              danger
              ghost
              // onClick={() => console.log('postId', postSelected?.id)}
              onClick={() => handleLike(postSelected.id)}
              icon={
                iLikeIt.length > 0 ? (
                  <HeartFilled style={{ fontSize: '30px' }} />
                ) : (
                  <HeartOutlined style={{ fontSize: '30px', color: '#585858' }} />
                )
              }
            />
            <Badge
              overflowCount={99999}
              style={{
                fontSize: '25px',
                height: 'auto',
                width: 'auto',
                color: '#000000',
                backgroundColor: 'transparent',
              }}
              count={likes.length}></Badge>
          </Space>
          <Space align='center'>
            <Avatar.Group maxStyle={{ backgroundColor: '#2bd8c4' }} size={'small'} maxCount={1}>
              {likes.map((like) => (
                <Avatar size={'small'} src={like.picture} />
              ))}
            </Avatar.Group>
            <Typography.Paragraph style={{ marginBottom: '0px', fontSize: '12px' }}>
              {likes.length > 0 &&
                `a ${likes.map((like) => like.user_name)[0]}${
                  likes.length - 1 > 0
                    ? ` y ${likes.length - 1} ${likes.length - 1 > 1 ? 'personas' : 'persona'} mas les gusta esto`
                    : ' le gusta esto'
                }`}
            </Typography.Paragraph>
          </Space>
        </Space>
      }>
      <Row gutter={[0, 0]}>
        <Col span={24}>
          <Card
            title={<Typography.Title level={5}>{postSelected.title}</Typography.Title>}
            style={{ width: '100%' }}
            bodyStyle={{ padding: '10px 10px' }}
            bordered={false}
            cover={
              <div
                style={{
                  backgroundImage: `url(${postSelected.image})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                <Image
                  /* onDoubleClick={() => handleLike(postSelected.id)} */
                  width={'100%'}
                  style={{
                    minHeight: '420px',
                    objectFit:
                      screens.xs && handleDeviceOrientation() === 'VERTICAL'
                        ? 'contain'
                        : !screens.lg && !screens.xl && handleDeviceOrientation() === 'HORIZONTAL'
                        ? 'cover'
                        : 'unset',
                    backgroundColor: '#00000033',
                    backdropFilter: 'blur(8px)',
                  }}
                  src={postSelected.image}
                  preview={false}
                />
              </div>
            }></Card>
        </Col>
      </Row>
    </Drawer>
  );
}
