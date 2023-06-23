import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import {
  AuditOutlined,
  CoffeeOutlined,
  ControlOutlined,
  FormOutlined,
  FullscreenOutlined,
  GlobalOutlined,
  HeartOutlined, HistoryOutlined,
  OrderedListOutlined,
  ScissorOutlined,
  SettingOutlined, TableOutlined,
  UserOutlined,
  ZoomInOutlined
} from '@ant-design/icons';

import { Button, Col, Grid, Layout, Menu, message, Row, Space } from 'antd';
import ReportsDropdown from './ReportsDropdown/ReportsDropdown';

import AuthContext from '../../contexts/AuthContext';
import '../../styles/Dashboard.css';

const { Header, Content, Sider } = Layout;

const Dashboard: React.FC = (props) => {
  const { adminRole } = useContext(AuthContext);
  const { writeAccess } = adminRole;
  const authContext = useContext(AuthContext);

  const history = useHistory();
  const screens = Grid.useBreakpoint();

  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const menu = [
	{
	  text: 'Працівники',
	  icon: <UserOutlined/>,
	  url: '/employees'
	},
	{
	  text: 'Виконроби',
	  icon: <ControlOutlined/>,
	  url: '/contractors'
	},
	{
	  text: 'Посади',
	  icon: <AuditOutlined/>,
	  url: '/positions'
	},
	{
	  text: 'Категорії посад',
	  icon: <OrderedListOutlined/>,
	  url: '/categories'
	},
	{
	  text: 'Регіони',
	  icon: <GlobalOutlined/>,
	  url: '/regions'
	},
	{
	  text: 'Об\'єкти',
	  icon: <FullscreenOutlined/>,
	  url: '/objects'
	},
	{
	  text: 'Перевірки',
	  icon: <ZoomInOutlined/>,
	  url: '/checks'
	},
	{
	  text: 'Примітки',
	  icon: <FormOutlined/>,
	  url: '/appeals'
	},
	{
	  text: 'Інтерактивна таблиця',
	  icon: <TableOutlined/>,
	  url: '/interactive-table'
	},
	{
	  text: 'Історія змін к-сті годин',
	  icon: <HistoryOutlined/>,
	  url: '/working-hours-changes'
	},
	{
	  text: 'Реєстраційні коди',
	  icon: <ScissorOutlined/>,
	  url: '/codes'
	},
	{
	  text: 'Дні народження',
	  icon: <HeartOutlined/>,
	  url: '/birthdays'
	}
  ];

  if (writeAccess) {
	menu.push({
	  text: 'Налаштування',
	  icon: <SettingOutlined/>,
	  url: '/settings'
	});

	menu.push({
	  text: 'Адміни',
	  icon: <CoffeeOutlined/>,
	  url: '/admins'
	});
  }

  const onMenuSelected = ({ key }) => {
	history.push(key);
  };

  useEffect(() => {
	checkResolutionAndWarn();
  }, []);

  return (
	<Layout style={{ minHeight: '100vh' }}>
	  {/* Menu */}
	  <Sider
		width={250}
		breakpoint="sm"
		collapsible
		collapsed={menuCollapsed}
		onCollapse={menuCollapsed => setMenuCollapsed(menuCollapsed)}
		style={{
		  height: '100vh',
		  position: 'fixed',
		  left: 0
		}}
	  >
		<div className="Logo">
		  <Row align="middle">
			<Col span={menuCollapsed ? 24 : 'auto'}>
			  <img src="logo.png" alt="Logo"/>
			</Col>
			<Col span={menuCollapsed ? 0 : 'auto'}>
			  <h1>Terraprof Admin</h1>
			</Col>
		  </Row>
		</div>

		<Menu
		  theme="dark"
		  selectedKeys={[window.location.pathname]}
		  onSelect={onMenuSelected}
		  mode="inline"
		>
		  {menu.map((item, i) =>
			(
			  <Menu.Item key={item.url} icon={item.icon}>
				<span>{item.text}</span>
			  </Menu.Item>
			)
		  )}
		</Menu>
	  </Sider>

	  <Layout style={{ marginLeft: menuCollapsed ? 80 : 250 }}>
		{/* Header */}
		<Header style={{ padding: 0 }}>
		  <Row justify="end">
			<Col>
			  <Space size="middle">
				<ReportsDropdown/>
				<Button
				  danger
				  className="SignOutButton"
				  type="primary"
				  onClick={authContext.logout}
				>
				  Вийти
				</Button>
			  </Space>
			</Col>
		  </Row>
		</Header>

		{/* Content */}
		<Content style={{ margin: '15px' }}>
		  {props.children}
		</Content>
	  </Layout>
	</Layout>
  );
};

const checkResolutionAndWarn = () => {
  if (window.screen.width < 768) {
	message.warn('Дані відображені не повністю. Рекомендуємо змінити оріентацію смартфона', 5);
  }
};

export default Dashboard;
