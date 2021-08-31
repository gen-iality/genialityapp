import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import EvenTable from '../events/shared/table';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import Pagination from '../shared/pagination';
import SearchComponent from '../shared/searchTable';
import { Space, Button, Row, Col, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Meta } = Card;

class SpeakersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      list: [],
      speakersList: [],
      pageOfItems: [],
      changeItem: false,
      redirect: false,
    };
  }

  componentDidMount() {
    this.fetchSpeakers();
  }

  fetchSpeakers = async () => {
    const data = await SpeakersApi.byEvent(this.props.eventID);
    this.setState({ list: data, speakersList: data, loading: false });
  };

  redirect = () => this.setState({ redirect: true });

  remove = (info) => {
    console.log('info eliminar', info._id, 'idevento', this.props.eventID);
    sweetAlert.twoButton(`Está seguro de borrar a ${info.name}`, 'warning', true, 'Borrar', async (result) => {
      try {
        sweetAlert.showLoading('Espera (:', 'Borrando...');
        await SpeakersApi.deleteOne(info._id, this.props.eventID);
        this.fetchSpeakers();
        sweetAlert.hideLoading();
        sweetAlert.showSuccess('Conferencista borrado');
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };

  goBack = () => this.props.history.goBack();

  searchResult = (data) => {
    !data ? this.setState({ list: [] }) : this.setState({ list: data });
  };

  onChangePage = (pageOfItems) => {
    this.setState({ pageOfItems: pageOfItems });
  };

  render() {
    if (this.state.redirect)
      return <Redirect to={{ pathname: `${this.props.matchUrl}/speaker`, state: { new: true } }} />;
    const { list, speakersList, pageOfItems, loading } = this.state;

    if (loading) return <Loading />;
    return (
      <EventContent
        title='Conferencistas'
        closeAction={this.props.location.state && this.goBack}
        description={'Agregue o edite las personas que son conferencistas'}
        addAction={this.redirect}
        addTitle={'Nuevo conferencista'}
        actionLeft={
          <SearchComponent
            data={speakersList}
            placeholder={'por Nombre'}
            kind={'speakers'}
            classes={'field'}
            searchResult={this.searchResult}
          />
        }>
        <Row justify='left' gutter={[25, 25]}>
          {speakersList.map((speaker) => (
            <Col key={speaker._id} xs={12} sm={8} md={6} lg={6} xl={4} xxl={4}>
              <Card
                hoverable
                style={{ width: '100%' }}
                bodyStyle={{padding:'10px', minHeight: '80px'}}
                actions={[
                  <Link key='edit' to={{ pathname: `${this.props.matchUrl}/speaker`, state: { edit: speaker._id } }}>
                    <Button icon={<EditOutlined />} />
                  </Link>,
                  <Button
                    key='delete'
                    onClick={() => {
                      this.remove(speaker);
                    }}
                    icon={<DeleteOutlined />}
                    type='danger'
                  />,
                ]}
                cover={
                  <img
                    style={{ height: '150px', objectFit: 'cover' }}
                    alt='example'
                    src={
                      speaker.image ? speaker.image : 'https://via.placeholder.com/150x100/C6C6C6/A2A2A2?text=Sin%20Foto'
                    }
                  />
                }>
                  <Typography.Paragraph ellipsis={{rows:2}} strong>{speaker.name}</Typography.Paragraph>
                
              </Card>

              {/* {' '}
                <tr key={speaker._id} style={{ background: '#cccccc' }}>
                  <td>
                    <div style={{ display: 'flex' }}>
                      {speaker.image && (
                        <img src={speaker.image} alt={`speaker_${speaker.name}`} className='author-image' />
                      )}
                      <p style={{ margin: 'auto 0', paddingLeft: '10px', fontSize: '1.25em' }}>{speaker.name}</p>
                    </div>
                  </td>
                  <td>
                    <Space>
                      <Link to={{ pathname: `${this.props.matchUrl}/speaker`, state: { edit: speaker._id } }}>
                        <Button icon={<EditOutlined />}>Editar</Button>
                      </Link>
                      <Button
                        onClick={() => {
                          this.remove(speaker);
                        }}
                        icon={<DeleteOutlined />}
                        type='danger'>
                        Eliminar
                      </Button>
                    </Space>
                  </td>
                </tr> */}
            </Col>
          ))}
        </Row>

        <Pagination items={list} change={this.state.changeItem} onChangePage={this.onChangePage} />
      </EventContent>
    );
  }
}

export default withRouter(SpeakersList);
