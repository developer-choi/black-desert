import React, {PropsWithChildren, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {stopPropagation} from '@util/extend/event';
import Image from 'next/image';
import classNames from 'classnames';
import {isMatchKeyboardEvent} from '@util/extend/keyboard-event';

export interface ModalProp extends PropsWithChildren<{}>{
  visible: boolean;
  close: () => void;
  title: string;
  easilyClose?: boolean;
}

export default function Modal({visible, title, close, children, easilyClose}: ModalProp) {
  const onBackdropClick = useCallback(() => {
    if (easilyClose) {
      close();
    }
  }, [close, easilyClose]);

  useEffect(() => {
    const escToClose = (event: KeyboardEvent) => {
      if (easilyClose && isMatchKeyboardEvent(event, {key: 'Escape'})) {
        close();
      }
    };

    window.addEventListener('keydown', escToClose);

    return () => {
      window.removeEventListener('keydown', escToClose);
    };

  }, [visible, easilyClose, close]);

  useEffect(() => {
    if(visible) {
      document.body.style.overflow = "hidden";
      document.body.focus();

    } else {
      document.body.style.overflow = "auto";
    }
  }, [visible]);

  return (
    <Backdrop className={classNames({visible})} onClick={onBackdropClick}>
      <Inner onClick={stopPropagation}>
        <Header>
          <Title>{title}</Title>
          <button onClick={close}>
            <Image src="/close.png" alt="close" width={30} height={30}/>
          </button>
        </Header>
        <Children>
          {children}
        </Children>
      </Inner>
    </Backdrop>
  )
}

const Backdrop = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  display: none;
  position: fixed;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  
  &.visible {
    display: flex;
  }
`;

const Inner = styled.div`
  background-color: white;
  min-width: 450px;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const Title = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const Children = styled.div`
  padding: 0 20px 20px 20px;
`;