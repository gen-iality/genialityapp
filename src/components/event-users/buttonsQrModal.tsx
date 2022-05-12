import { userCheckIn } from '@/Utilities/checkInUtils';
import { Button, Col, Row } from 'antd';

type SearchAndCleanButtonsPropTypes = {
  cleanInputSearch: () => void;
};
type CheckinAndReadOtherButtons = {
  qrData: {
    user: {} | any;
    another: boolean;
  };
  setQrData: (data: any) => void;
  handleScan: (data: any) => void;
  setCheckInLoader: (data: any) => void;
  checkIn: (id: any, user: any) => any;
  findAnotherUser: (data: any) => void;
};

export const SearchAndCleanButtons = ({ cleanInputSearch }: SearchAndCleanButtonsPropTypes) => {
  return (
    <Row justify='center' wrap gutter={8}>
      <Col>
        <Button type='primary' htmlType='submit'>
          Buscar
        </Button>
      </Col>
      <Col>
        <Button type='ghost' onClick={() => cleanInputSearch()}>
          Limpiar
        </Button>
      </Col>
    </Row>
  );
};

export const CheckinAndReadOtherButtons = ({
  qrData,
  setQrData,
  handleScan,
  setCheckInLoader,
  checkIn,
  findAnotherUser,
}: CheckinAndReadOtherButtons) => {
  return (
    <Row justify='center' wrap gutter={8}>
      <Col>
        {!qrData.user?.checked_in && !qrData?.user?.checkedin_at && !qrData.another && (
          <Button
            type='primary'
            onClick={() => {
              userCheckIn({ qrData, setQrData, handleScan, setCheckInLoader, checkIn });
            }}>
            Check User
          </Button>
        )}
      </Col>
      <Col>
        <Button className='button' onClick={findAnotherUser}>
          Read Other
        </Button>
      </Col>
    </Row>
  );
};
