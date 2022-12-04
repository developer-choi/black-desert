import React, {useCallback} from 'react';
import styled from 'styled-components';

export interface GuideProp {
  title: string;
  description: string;
  img: string;
}

export default function Guide({img, description, title}: GuideProp) {
  const clickToNewTab = useCallback((src: string) => {
    window.open(src);
  }, []);

  return (
    <Wrap>
      <Title>{title}</Title>
      <img src={img} alt="가이드" width="1200" onClick={() => clickToNewTab(img)}/>
      <Description dangerouslySetInnerHTML={{__html: description}}/>
    </Wrap>
  );
}

const Wrap = styled.div`
  img {
    cursor: pointer;
  }
  
  margin-bottom: 40px !important;
`;

const Title = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 18px;
  
  em {
    font-weight: bold;
    color: black;
  }
`;
