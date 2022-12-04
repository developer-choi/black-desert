import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

export default function Page() {
  return (
    <Wrap>
      {PAGE_LINKS.map(({name, href}) => (
        <Link key={href} href={href} passHref>
          <Anchor>{name}</Anchor>
        </Link>
      ))}
    </Wrap>
  );
}

export const PAGE_LINKS: {name: string, href: string;}[] = [
  {name: '거래소 계산기', href: '/market'},
  {name: '쿠폰 일괄 전송', href: '/coupons'},
  {name: '검사데이 당첨확인', href: '/bdo-day'},
  {name: '고유결 계산기', href: '/gyg'},
];

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 400px);
  grid-template-rows: repeat(2, 160px);
  grid-gap: 20px;
`;

const Anchor = styled.a`
  border: 3px solid lightgray;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.4s;
  
  &:hover {
    border-color: ${props => props.theme.main};
  }
`;
