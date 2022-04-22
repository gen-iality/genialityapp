import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import { setTopBanner } from '../../../redux/topBanner/actions';
import withContext from '../../../context/withContext';
import { useLocation, withRouter } from 'react-router-dom';
import { NewsFeed } from '../../../helpers/request';
import { Card, Row, Spin, Col, Space, Tag, Grid, Image, Typography, Divider } from 'antd';
import NoticiaList from './NoticiasList';
import ReactPlayer from 'react-player';
import ReactQuill from 'react-quill';

const { useBreakpoint } = Grid;
const { Meta } = Card;
const { Title } = Typography;

const imgNotFound =
  'data:image/png;base64,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';
const NoticiasDetails = (props) => {
  let { setVirtualConference, match, setTopBanner } = props;
  const location = useLocation();
  const [eventId, setEventId] = useState(props.cEvent.value._id);
  const [loading, setLoading] = useState(true);
  const [noticia, setNoticia] = useState();

  const screens = useBreakpoint();

  useEffect(() => {
    setVirtualConference(false);
    setTopBanner(false);
    window.scrollTo(0, 0);

    getOne();

    return () => {
      setVirtualConference(true);
      setTopBanner(true);
    };
  }, [props.match?.params?.id]);

  const getOne = async () => {
    const data = await NewsFeed.getOne(eventId, props?.match?.params?.id);
    if (data) {
      setNoticia(data);
      /* console.log(data, noticia, 'data-noticia', match.params.id) */
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spin />}
      {noticia && (
        <>
          <Row gutter={[8, 8]} wrap justify='center'>
            <Col span={24}>
              <Card style={{ backgroundColor: '#F9F9F9' }} bordered={false}>
                <Meta
                  title={
                    <div style={{ textAlign: 'center' }}>
                      <Title level={2}>{noticia && noticia.title}</Title>
                    </div>
                  }
                  description={
                    <div style={{ textAlign: 'center' }}>
                      <span>
                        {/* {noticia && noticia.time}  |  */} Actualizado: {noticia && noticia.updated_at}
                      </span>
                    </div>
                  }
                />
                <br />
                <Card
                  bordered={false}
                  cover={
                    noticia &&
                    (noticia.linkYoutube === null || noticia.linkYoutube === '' || noticia.linkYoutube === undefined ? (
                      <Image
                        style={{ height: `${screens.xs ? '25vh' : '55vh'}`, objectFit: 'cover' }}
                        alt={'imagen noticia'}
                        src={
                          noticia && (noticia.image || noticia.picture) ? noticia.image || noticia.picture : imgNotFound
                        }
                      />
                    ) : (
                      <div className='mediaplayer'>
                        <ReactPlayer
                          style={{ height: `${screens.xs ? '25vh' : '55vh'}`, objectFit: 'cover' }}
                          width='100%'
                          url={noticia.linkYoutube}
                          controls
                        />
                      </div>
                    ))
                  }>
                  <Meta
                    title={
                      noticia && (
                        <div
                          id='img-informative' /* style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{ __html: noticia.description_short }} */
                        >
                          <ReactQuill
                            value={noticia.description_short}
                            readOnly={true}
                            className='hide-toolbar ql-toolbar'
                            theme='bubble'
                          />
                        </div>
                      )
                    }
                    description={
                      noticia && (
                        <div
                          id='img-informative' /* dangerouslySetInnerHTML={{ __html: noticia.description_complete }} */
                        >
                          <ReactQuill
                            value={noticia.description_complete}
                            readOnly={true}
                            className='hide-toolbar ql-toolbar'
                            theme='bubble'
                          />
                        </div>
                      )
                    }
                  />
                </Card>
                <br />
                <Divider orientation='left' style={{ fontWeight: 'bold' }}>
                  Otras noticias que te pueden interesar
                </Divider>
                {/* <br /> */}
                <NoticiaList size={screens.xs ? 1 : screens.lg ? 3 : 2} newId={noticia._id} />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
const mapDispatchToProps = {
  setVirtualConference,
  setTopBanner,
};
let NoticiasDetailsConnect = connect(null, mapDispatchToProps)(withContext(withRouter(NoticiasDetails)));
export default NoticiasDetailsConnect;
