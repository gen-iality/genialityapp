import * as React from 'react';
import { useState } from 'react';

import {
  Row,
  Col,
  Affix,
} from 'antd';

export interface ActivityContentManagerProps {};

function ActivityContentManager(props: ActivityContentManagerProps) {
  return (
    <>
    <Row gutter={[16, 16]}>
      <Col span={10}>
        <Affix offsetTop={80}>
          <></>
          {/* Here the viewer */}
        </Affix>
      </Col>

      <Col span={14}>
        <Row gutter={[16, 16]}>
          <></>
        </Row>
      </Col>
    </Row>
    </>
  );
}

export default ActivityContentManager;
