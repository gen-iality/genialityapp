import { BackTop as BackTopAnt, Button, Tooltip } from 'antd';
import { UpOutlined } from '@ant-design/icons';

const BackTop = ( props ) => {

  return (
    <>
      <BackTopAnt style={{marginRight: '-80px'}}>
        <Tooltip title='Subir para guardar cambios'>
          <Button 
            type='primary' 
            shape={'circle'} 
            icon={<UpOutlined />} 
            className='animate__animated animate__pulse' 
            size='large' 
          />{/* animate__infinite animate__slow */}
        </Tooltip>
      </BackTopAnt>
    </>
  )
}

export default BackTop;