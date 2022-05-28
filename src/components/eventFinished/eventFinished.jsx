import { withRouter } from 'react-router-dom';
import { Result } from 'antd';
import { imageUtils } from '../../Utilities/ImageUtils';

function EventFinished() {
  return <Result icon={<img width='40%' src={require(imageUtils.NOTFOUND)} />} title='Este curso ha finalizado' />;
}

export default withRouter(EventFinished);
