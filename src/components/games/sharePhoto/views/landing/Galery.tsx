import { HeartFilled, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Comment,
  Drawer,
  Grid,
  Image,
  Input,
  PageHeader,
  Row,
  Space,
  Typography,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import useSharePhoto from '../../hooks/useSharePhoto';
import useSharePhotoInLanding from '../../hooks/useSharePhotoInLanding';
import { Post } from '../../types';

const { Meta } = Card;
const { useBreakpoint } = Grid;

export default function Galery() {
  const { goTo } = useSharePhotoInLanding();
  const { sharePhoto, addLike, listenSharePhoto } = useSharePhoto();
  const [postSelected, setPostSelected] = useState<Post | null>(null);
  const [overlay, setOverlay] = useState('');

  const screens = useBreakpoint();

  const handleBack = () => {
    if (postSelected !== null) {
      setPostSelected(null);
    } else {
      goTo('chooseAction');
    }
  };

  // useEffect(() => {
  //   const postUpdated = sharePhoto?.posts.find((post) => post.id === postSelected?.id);
  //   if (postUpdated) {
  //     setPostSelected(postUpdated);
  //   }
  //   // console.log('postSelected', postSelected);
  // }, [sharePhoto?.posts]);

  useEffect(() => {
    const unSubscribe = listenSharePhoto();
    return () => unSubscribe();
  }, []);
  console.log('post', sharePhoto?.posts);
  return (
    <>
      {postSelected && (
        <Drawer
          bodyStyle={{ padding: screens.xs ? '0px' : '0' }}
          width={screens.xs ? '100vw' : '40vw'}
          visible={postSelected ? true : false}
          onClose={() => handleBack()}>
          <Row gutter={[0, 0]}>
            <Col span={24}>
              <PageHeader
                style={{ padding: '0px 10px' }}
                avatar={{ icon: <UserOutlined />, src: postSelected.picture }}
                title={
                  <Typography.Text type='secondary' style={{ fontSize: screens.xs ? '16px' : '18px' }}>
                    {postSelected.user_name}
                  </Typography.Text>
                }
                children={<Typography.Title level={4}>{postSelected.title}</Typography.Title>}
              />
            </Col>

            <Col span={24}>
              <Card
                style={{ width: '100%' }}
                bodyStyle={{ padding: '10px 10px' }}
                bordered={false}
                cover={
                  <Image
                    width={'100%'}
                    style={{ maxHeight: '450px', minHeight: '450px', objectFit: 'cover', borderRadius: '0px' }}
                    src={postSelected.image}
                    preview={false}
                  />
                }>
                <Space>
                  <Button
                    size='large'
                    style={{ width: '100%', height: '100%', padding: 2, margin: 2, border: 'none' }}
                    danger
                    ghost
                    // onClick={() => console.log('postId', postSelected?.id)}
                    onClick={() => addLike(postSelected.id)}
                    icon={<HeartFilled style={{ fontSize: '40px' }} />}
                  />
                  <Badge
                    overflowCount={99999}
                    style={{
                      fontSize: '28px',
                      height: 'auto',
                      width: 'auto',
                      color: '#000000',
                      backgroundColor: '#FFFFFF',
                    }}
                    count={postSelected.likes.length}></Badge>
                </Space>
              </Card>
            </Col>
          </Row>
        </Drawer>
      )}
      <Row align='middle' justify='center'>
        <Col>
          <Row align='middle' justify='center'>
            <Input.Search
              style={{ marginBottom: '20px' }}
              placeholder='input search text'
              allowClear
              enterButton='Search'
              size='large'
              onSearch={console.log}
            />
          </Row>
        </Col>
      </Row>
      <Row gutter={[16, 0]}>
        {sharePhoto?.posts.map((post) => (
          <Col
            key={post.id}
            onClick={() => setPostSelected(post)}
            onMouseEnter={() => setOverlay(post.id)}
            onMouseLeave={() => setOverlay('')}
            xs={8}
            sm={8}
            md={6}
            lg={4}
            xl={4}
            xxl={4}
            style={{
              backgroundImage: `url(${post.thumb || 'https://via.placeholder.com/500/?text=Error'})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              scrollSnapAlign: 'center',
              backgroundPosition: 'center',
              height: '100%',
              aspectRatio: '4/4',
              padding: '0px',
            }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0000004d',
                backdropFilter: 'blur(2px)',
                display: `${overlay === post.id ? 'block' : 'none'}`,
                cursor: 'pointer',
              }}>
              <Row justify='center' align='middle' style={{ height: '100%' }}>
                <Space style={{ fontSize: '20px', color: '#FFFFFF' }}>
                  <HeartFilled />
                  {post.likes.length}
                </Space>
              </Row>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}
