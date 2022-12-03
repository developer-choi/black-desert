import React, {PropsWithChildren} from 'react';
import styled from 'styled-components';
import Sidebar, {ASIDE_WIDTH} from '@component/layout/Sidebar';

export default function Layout({children}: PropsWithChildren<{}>) {

  return (
    <Wrap>
      <Sidebar/>
      <Main>{children}</Main>
    </Wrap>
  );
}

const Wrap = styled.div`
  height: 100%;
`;

const Main = styled.main`
  margin-left: ${ASIDE_WIDTH}px;
  padding: 20px;
  
  > :not(h1) {
    margin-bottom: 15px;
  }
`;
