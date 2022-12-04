import React from 'react';
import styled, {css} from 'styled-components';

const buttonHoverEffect = css`
  //hover, active, disabled는 이 순서로 선언이 되야 opacity가 직관적으로 작동함.
  :hover {
    opacity: 0.7;
  }
  
  :active {
    opacity: 1;
  }
  
  :disabled {
    opacity: initial;
  }
`;

const Button = styled.button`
  padding: 10px 25px;
  min-width: 80px;
  border-radius: 10px; //size에는 border-radius도 포함되고,
  flex-shrink: 0; //버튼들 중에는 길이가 줄어들면 안되는 경우도 있어서 여기에 선언한다.
  background-color: ${props => props.theme.main};
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  //<SomeButton as='a'로 만들 때 필요한 css
  a& {
    // button은 이 값이 기본값이지만, a tag는 아님.
    text-align: center;
    line-height: normal;
  }
  
  :disabled {
    cursor: not-allowed;
  }
  
  &.hover-effect {
    ${buttonHoverEffect};
  }
  
  //주로 이미지를 button으로 감쌀 때 쓰는데, 버튼안에 오는 이미지가 중앙정렬을 시키려고 할 때 씀.
  &.center {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  
  &.small {
    padding: 4px 8px;
    min-width: 50px;
    font-size: 12px;
    border-radius: 5px;
  }
  
  &.full {
    width: 100%;
  }
    
  &.orange {
    background-color: #ff9800;
  }
  
  &.blue {
    background-color: #209cff;
  }
`;

export default Button;
