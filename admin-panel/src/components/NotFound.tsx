import React from 'react';
import { Result } from 'antd';

const NotFound: React.FC = () => {
  return (
	<Result
	  status="404"
	  title="404"
	  subTitle="Страница не найдена"
	/>
  );
};

export default NotFound;
