import { DownOutlined, HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Dropdown, Menu, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { IBreadCrumbles } from './typings/interfaces';
import { legalPage } from './constant';

const BreadCrumbles = (props: IBreadCrumbles) => {
	const { currentPage } = props;
	const menu = (
		<Menu>
			<Menu.Item>
				<Link to={'/terms'}>{legalPage.TERMS_AND_CONDITIONS}</Link>
			</Menu.Item>
			<Menu.Item>
				<Link to={'/privacy'}>{legalPage.PRIVACY_POLICY}</Link>
			</Menu.Item>
		</Menu>
	);

	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to={'/'}>
					<Space size={4}>
						<HomeOutlined />
						<span>Home</span>
					</Space>
				</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>
				<Space size={4}>
					{currentPage}
					<Dropdown trigger={['click']} overlay={menu}>
						<DownOutlined style={{fontSize:'12px', color:'#CCCCCC'}} />
					</Dropdown>
				</Space>
			</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default BreadCrumbles;
