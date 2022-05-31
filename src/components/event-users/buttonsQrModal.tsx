import { userCheckIn } from '@/Utilities/checkInUtils';
import { Button, Col, Row } from 'antd';

type SearchAndCleanButtonsPropTypes = {
  cleanInputSearch: () => void;
};
type CheckinAndReadOtherButtonsPropsTypes = {
  scannerData: {
    user: {} | any;
    another: boolean;
  };
  setScannerData: (data: any) => void;
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
  scannerData,
  setScannerData,
  handleScan,
  setCheckInLoader,
  checkIn,
  findAnotherUser,
}: CheckinAndReadOtherButtonsPropsTypes) => {
  return (
    <Row justify='center' wrap gutter={8}>
      <Col>
        {!scannerData.user?.checked_in && !scannerData?.user?.checkedin_at && !scannerData.another && (
          <Button
            type='primary'
            onClick={() => {
              userCheckIn({ scannerData, setScannerData, handleScan, setCheckInLoader, checkIn });
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
