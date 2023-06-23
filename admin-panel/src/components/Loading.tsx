import React from 'react';
import { Col, Row, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading: React.FC = () => {
  return (
	<Row justify="center" align="middle" style={{ height: '100%' }}>
	  <Col>
		<Spin size="large" indicator={<LoadingOutlined/>}/>
	  </Col>
	</Row>
  );
};

export default Loading;
