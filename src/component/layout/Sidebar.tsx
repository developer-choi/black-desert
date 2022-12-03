import React from 'react';
import styled from 'styled-components';
import {PAGE_LINKS} from '@pages/index';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <Aside>
      {PAGE_LINKS.map(({name, href}) => (
        <Link key={name} href={href} passHref>
          <Anchor>{name}</Anchor>
        </Link>
      ))}
    </Aside>
  );
}

export const ASIDE_WIDTH = 240;

const Aside = styled.aside`
  width: ${ASIDE_WIDTH}px;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.main}20;
`;

const Anchor = styled.a`
  padding: 20px;
  &:hover {
    color: ${props => props.theme.main};
  }
`;
