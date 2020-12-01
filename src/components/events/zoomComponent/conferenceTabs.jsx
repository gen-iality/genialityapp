import React, {useState} from 'react';
import { Tabs, Row, Button, Menu, } from 'antd';
import { CommentOutlined, PieChartOutlined, TeamOutlined, RightOutlined, LeftOutlined, BuildOutlined } from '@ant-design/icons';
import ListadoJuegos from './listadoJuegos';
import LiveChat from './liveChat';

const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}

export default function ConferenceTabsComponent(props) {
  let [collapsed, setCollapsed] = useState(false)
  return (
    <div style={{ position:"relative" }}>
      <Button onClick={()=>setCollapsed(collapsed === false ? true : false)} style={{position:"absolute", right:"103%"}}>
        {React.createElement(collapsed ? RightOutlined : LeftOutlined, {
          className: 'trigger',
          onClick:()=>setCollapsed(collapsed === false ? true : false)
        })}
      </Button>
      { collapsed === true ? (
       <div style={{padding:"7%"}}>
        <Tabs defaultActiveKey='1' onChange={callback}>
          <TabPane tab={<BuildOutlined />} key='1'>
            <ListadoJuegos {...props} />
          </TabPane>
          <TabPane tab={<CommentOutlined />} key='2'>
            <LiveChat {...props} />
          </TabPane>
          <TabPane tab={<PieChartOutlined />} key='3'>
           Asistentes
          </TabPane>
          <TabPane tab={<TeamOutlined />} key='4'>
            Encuestas
           </TabPane>     
        </Tabs>
      </div>
      ):(
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
         >
          <Menu.Item key="mail" icon={<BuildOutlined />}>
          </Menu.Item>
          <Menu.Item key="chat" icon={<CommentOutlined />}>
          </Menu.Item>
          <Menu.Item key="asistentes" icon={<PieChartOutlined />}>
          </Menu.Item>
          <Menu.Item key="asistentes" icon={<TeamOutlined />}>
          </Menu.Item>
        </Menu>
      )
      }
      
    </div>
    
  );
}
