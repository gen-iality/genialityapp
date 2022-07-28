import { Button, Drawer, Grid, Space, Spin } from 'antd';
import { renderTypeComponent } from '../hooks/functions';
import CellphoneIcon from '@2fd/ant-design-icons/lib/Cellphone';
import TabletAndroidIcon from '@2fd/ant-design-icons/lib/TabletAndroid';
import LaptopIcon from '@2fd/ant-design-icons/lib/Laptop';
import MonitorScreenshotIcon from '@2fd/ant-design-icons/lib/MonitorScreenshot';
import { useEffect, useState } from 'react';
import { RenderSectios } from './renderSectios';

const { useBreakpoint } = Grid;

const DrawerPreview = ({ visibleDrawer, setVisibleDrawer }) => {
  const [device, setdevice] = useState({ device: 'smartphone', value: 425 });
  const screens = useBreakpoint();
  const [refreshSections, setRefreshSections] = useState(false);
  useEffect(() => {
    if (!visibleDrawer) setRefreshSections(false);
    setRefreshSections(true);
  }, [visibleDrawer]);

  return (
    <Drawer
      contentWrapperStyle={{ transition: 'all 500ms ease 0s' }}
      /* drawerStyle={{ backgroundColor: '#000000' }} aqui se puede simular el color de fondo  */
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
      {visibleDrawer ? <RenderSectios /> : <Spin />}
    </Drawer>
  );
};
export default DrawerPreview;
