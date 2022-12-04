import React from 'react';
import styled from 'styled-components';
import {PAGE_LINKS} from '@pages/index';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  return (
    <Aside>
      <Link key="main" href="/" passHref>
        <Anchor>Home</Anchor>
      </Link>
      {PAGE_LINKS.map(({name, href}) => (
        <Link key={name} href={href} passHref>
          <Anchor>{name}</Anchor>
        </Link>
      ))}
      {EXTERNAL_LINKS.map(({img, name, href}) => (
        <Anchor key={name} target="_blank" href={href}>
          <Image src={img} alt="링크 파비콘" width={20} height={20}/>
          <span>{name}</span>
        </Anchor>
      ))}
    </Aside>
  );
}

export const EXTERNAL_LINKS: {href: string, name: string; img: string}[] = [
  {name: '검은사막 바로가기', img: '/bdo.ico', href: 'https://www.kr.playblackdesert.com/ko-KR/main/index'},
  {name: '인벤 바로가기', img: '/inven.ico', href: 'https://black.inven.co.kr'},
  {name: '가모스 바로가기', img: '/gamoth.png', href: 'https://garmoth.com'}
];

export const ASIDE_WIDTH = 240;

const Aside = styled.aside`
  width: ${ASIDE_WIDTH}px;
  height: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.veryLightMain};
`;

const Anchor = styled.a`
  display: flex;
  align-items: center;
  padding: 20px;
  
  span {
    margin-left: 5px;
  }
  
  &:hover {
    color: ${props => props.theme.main};
  }
`;
