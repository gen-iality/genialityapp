import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Space } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { IBreadCrumbles } from './typings/interfaces';


const BreadCrumbles = (props: IBreadCrumbles) => {
	const { currentPage } = props

	return (
		<Breadcrumb>
			<Breadcrumb.Item>
				<Link to={'/'}>
				<Space size={4}>
				<HomeOutlined /><span>Home</span>
				</Space>
				</Link>
			</Breadcrumb.Item>
			<Breadcrumb.Item>{ currentPage }</Breadcrumb.Item>
		</Breadcrumb>
	);
};

export default BreadCrumbles;
