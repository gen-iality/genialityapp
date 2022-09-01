import { Button, Drawer, Space } from 'antd';
import CellphoneIcon from '@2fd/ant-design-icons/lib/Cellphone';
import TabletAndroidIcon from '@2fd/ant-design-icons/lib/TabletAndroid';
import LaptopIcon from '@2fd/ant-design-icons/lib/Laptop';
import MonitorScreenshotIcon from '@2fd/ant-design-icons/lib/MonitorScreenshot';
import { useState } from 'react';
import ViewPrelanding from './viewPrelanding';

const DrawerPreviewLanding = ({ visibleDrawer, setVisibleDrawer }) => {
  const [device, setdevice] = useState({ device: 'smartphone', value: 425 });
  return (
    <Drawer
      contentWrapperStyle={{ transition: 'all 500ms ease 0s', backgroundColor: 'transparent' }}
      extra={
        <Space>
          <Button
            type={device.device === 'smartphone' ? 'primary' : 'default'}
            size='large'
            onClick={() => setdevice({ device: 'smartphone', value: 425 })}
            icon={<CellphoneIcon />}
          />
          <Button
            type={device.device === 'tablet' ? 'primary' : 'default'}
            size='large'
            onClick={() => setdevice({ device: 'tablet', value: 768 })}
            icon={<TabletAndroidIcon />}
          />
          <Button
            type={device.device === 'laptop' ? 'primary' : 'default'}
            size='large'
            onClick={() => setdevice({ device: 'laptop', value: 1440 })}
            icon={<LaptopIcon />}
          />
          <Button
            type={device.device === 'desktop' ? 'primary' : 'default'}
            size='large'
            onClick={() => setdevice({ device: 'desktop', value: '100%' })}
            icon={<MonitorScreenshotIcon />}
          />
        </Space>
      }
      className='viewReactQuill'
      width={device.value}
      placement='right'
      onClose={() => setVisibleDrawer(false)}
      visible={visibleDrawer}>
      <ViewPrelanding preview={device.device} />
    </Drawer>
  );
};

export default DrawerPreviewLanding;
