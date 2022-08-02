import { Button, Drawer, Grid, Space, Spin } from 'antd';
import { renderTypeComponent } from '../hooks/functions';
import CellphoneIcon from '@2fd/ant-design-icons/lib/Cellphone';
import TabletAndroidIcon from '@2fd/ant-design-icons/lib/TabletAndroid';
import LaptopIcon from '@2fd/ant-design-icons/lib/Laptop';
import MonitorScreenshotIcon from '@2fd/ant-design-icons/lib/MonitorScreenshot';
import { useEffect, useState, useContext } from 'react';
import { RenderSectios } from './renderSectios';
import { CurrentEventContext } from '@/context/eventContext';

const { useBreakpoint } = Grid;

const DrawerPreview = ({ visibleDrawer, setVisibleDrawer }) => {
  const [device, setdevice] = useState({ device: 'smartphone', value: 425 });
  const screens = useBreakpoint();
  const [refreshSections, setRefreshSections] = useState(false);
  const cEvent = useContext(CurrentEventContext);
  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;
  useEffect(() => {
    if (!visibleDrawer) setRefreshSections(false);
    setRefreshSections(true);
  }, [visibleDrawer]);

  return (
    <Drawer
      contentWrapperStyle={{ transition: 'all 500ms ease 0s', backgroundColor: 'transparent' }}
      drawerStyle={{ backgroundColor: bgColor }}
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
