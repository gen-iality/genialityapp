import { useHistory } from 'react-router-dom';
import { Table, Button, Row, Col } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { columns } from './tableColums/eventTableColumns';
import withContext from '../../context/withContext';
import Header from '../../antdComponents/Header';
import { useGetEventWithStatistics } from './hooks/useGetEventWithStatistics';
import { ExportExcel } from '@/components/newComponent/ExportExcel';
import { EventExcelColums } from './tableColums/utils/excelEventColums.utils';
import { parseDataToExcel } from './tableColums/utils/parseData.utils';

function OrgEvents(props: any) {
  let { _id: organizationId } = props.org;
  const history = useHistory();
  const { eventData, isLoading, pagination } = useGetEventWithStatistics(organizationId);

  const goToEvent = (eventId: string) => {
    const url = `/eventadmin/${eventId}/agenda`;
    history.replace({ pathname: url });
  };

  const linkToTheMenuRouteS = (menuRoute: string) => {
    window.open(`${window.location.origin}${menuRoute}`, '_blank', 'noopener,noreferrer');
  };

  const renderTitle = () => (
    <Row wrap justify='end' gutter={[8, 8]}>
      <Col>
        <ExportExcel columns={EventExcelColums} list={parseDataToExcel(eventData)} fileName={'eventReport'} />
      </Col>
      <Col>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => linkToTheMenuRouteS(`/create-event/${props.cUser?.value?._id}?orgId=${organizationId}`)}>
          {'Agregar'}
        </Button>
      </Col>
    </Row>
  );

  return (
    <>
      <Header title='Eventos' />
      <Table
        columns={columns(goToEvent)}
        dataSource={eventData}
        loading={isLoading}
        size='small'
        rowKey='index'
        pagination={pagination}
        title={renderTitle}
      />
    </>
  );
}

export default withContext(OrgEvents);
