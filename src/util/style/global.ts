import {createGlobalStyle, css} from 'styled-components';

const resetCss = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: transparent;
    border: none;
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
  
  ${resetCss};
`;
