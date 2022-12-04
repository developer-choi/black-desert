import {createGlobalStyle, css} from 'styled-components';

const resetCss = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: transparent;
    border: none;
  }
  
  li {
    list-style: none;
  }
  
  button {
    font-size: inherit;
  }
  
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Firefox */
  input[type=number] {
    -moz-appearance: textfield;
  }
  
  ::placeholder {
    color: #bbb;
  }
  
  em {
    font-style: initial;
  }
`;

export const GlobalStyle = createGlobalStyle`
  a {
    color: inherit;
    text-decoration: none;
  }
  
  html, body, #__next {
    height: 100%;
  }
  
  body {
    font-size: 14px;
  }
  
  ${resetCss};
`;
