import React from 'react';
import { Organization } from '../types';
import Facebook from '@2fd/ant-design-icons/lib/Facebook';

interface Props {
  organization: Organization | null;
}

export const SocialNetworks = ({ organization }: Props) => {
  return (
    <div
      style={{
        position: 'fixed',
        left: '100px',
        top: '100px',
        zIndex: 100,
        backgroundColor: `${organization?.styles?.containerBgColor || '#FFFFFF'}`,
        borderRadius: '12px',
      }}>
      {organization?.social_networks?.facebook && (
        <a href={organization?.social_networks?.facebook} target='_blank'>
          <Facebook style={{ fontSize: 40 }} />
        </a>
      )}

      {organization?.social_networks?.instagram && (
        <a href={organization?.social_networks?.facebook} target='_blank'>
          <Facebook style={{ fontSize: 40 }} />
        </a>
      )}

      {organization?.social_networks?.facebook && (
        <a href={organization?.social_networks?.facebook} target='_blank'>
          <Facebook style={{ fontSize: 40 }} />
        </a>
      )}

      {organization?.social_networks?.facebook && (
        <a href={organization?.social_networks?.facebook} target='_blank'>
          <Facebook style={{ fontSize: 40 }} />
        </a>
      )}

      {organization?.social_networks?.facebook && (
        <a href={organization?.social_networks?.facebook} target='_blank'>
          <Facebook style={{ fontSize: 40 }} />
        </a>
      )}
    </div>
  );
};
