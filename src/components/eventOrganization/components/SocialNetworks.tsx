import React from 'react';
import { Organization } from '../types';
import FacebookIcon from '@2fd/ant-design-icons/lib/Facebook';
import TwitterIcon from '@2fd/ant-design-icons/lib/Twitter';
import InstagramIcon from '@2fd/ant-design-icons/lib/Instagram';
import LinkedinIcon from '@2fd/ant-design-icons/lib/Linkedin';
import WebIcon from '@2fd/ant-design-icons/lib/Web';
import { Avatar, Row, Space } from 'antd';
import { getCorrectColor } from '@/helpers/utils';

interface Props {
  organization: Organization | null;
}

export const SocialNetworks = ({ organization }: Props) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: '6px',
        top: '70px',
        zIndex: 100,
        width: '40px',
        backgroundColor: `${organization?.styles?.containerBgColor || '#FFFFFF'}`,
        borderRadius: '10px',
        paddingTop: 8, 
        paddingBottom: 8,
        boxShadow: `5px 5px 2px #C4C4C490`
      }}
    >
      <Space size={8} direction='vertical' align='center' style={{paddingLeft: 4}}>
          {organization?.social_networks?.facebook && (
            <a href={organization?.social_networks?.facebook} target='_blank'>
              <Avatar 
                shape='square'
                style={{backgroundColor: getCorrectColor(organization?.styles?.containerBgColor)}}
              >
                <FacebookIcon style={{ fontSize: 30, color: organization?.styles?.containerBgColor }} />
              </Avatar>             
            </a>
          )}

          {organization?.social_networks?.twitter && (
            <a href={organization?.social_networks?.twitter} target='_blank'>
              <Avatar 
                shape='square'
                style={{backgroundColor: getCorrectColor(organization?.styles?.containerBgColor)}}
              >
                <TwitterIcon style={{ fontSize: 30, color: organization?.styles?.containerBgColor }} />
              </Avatar>
            </a>
          )}

          {organization?.social_networks?.instagram && (
            <a href={organization?.social_networks?.instagram} target='_blank'>
              <Avatar 
                shape='square'
                style={{backgroundColor: getCorrectColor(organization?.styles?.containerBgColor)}}
              >
                <InstagramIcon style={{ fontSize: 30, color: organization?.styles?.containerBgColor }} />
              </Avatar>
            </a>
          )}

          {organization?.social_networks?.linkedln && (
            <a href={organization?.social_networks?.linkedln} target='_blank'>
              <Avatar 
                shape='square'
                style={{backgroundColor: getCorrectColor(organization?.styles?.containerBgColor)}}
              >
                <LinkedinIcon style={{ fontSize: 30, color: organization?.styles?.containerBgColor }} />
              </Avatar>
            </a>
          )}

          {organization?.social_networks?.yourSite && (
            <a href={organization?.social_networks?.yourSite} target='_blank'>
              <Avatar 
                shape='square'
                style={{backgroundColor: getCorrectColor(organization?.styles?.containerBgColor)}}
              >
                <WebIcon style={{ fontSize: 30, color: organization?.styles?.containerBgColor }} />
              </Avatar>
            </a>
          )}
      </Space>
    </div>
  );
};
