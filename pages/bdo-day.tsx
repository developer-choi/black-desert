import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import Form from '@component/atoms/Form';
import InputText from '@component/atoms/InputText';
import TextArea from '@component/atoms/TextArea';
import {removeDuplicatedItems} from '@util/extend/core';

export default function Page() {

  const [nickname, setNickname] = useState('');
  const [registeredNicknames, setRegisteredNicknames] = useState<string[]>([]);
  const [texts, setTexts] = useState('');
  
  const nicknameRef = useRef<HTMLInputElement>(null);
  const textsRef = useRef<HTMLTextAreaElement>(null);
  
  const addNickname = useCallback(() => {
    setRegisteredNicknames(prevState => removeDuplicatedItems(prevState.concat(nickname)));
    setNickname('');
  }, [nickname]);
  
  const onDelete = useCallback((toDeleteNickname: string) => {
    setRegisteredNicknames(prevState => prevState.filter(originalNickname => originalNickname !== toDeleteNickname));
  }, []);
  
  useEffect(() => {
    const _registeredNicknames = JSON.parse(localStorage.getItem('registeredNicknames') as string);
  
    if (Array.isArray(_registeredNicknames) && _registeredNicknames.length > 0) {
      setRegisteredNicknames(_registeredNicknames);
      textsRef.current?.focus();
    
    } else {
      nicknameRef.current?.focus();
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('registeredNicknames', JSON.stringify(registeredNicknames));
  }, [registeredNicknames]);
  
  const matchNicknames = useMemo(() => {
  
    return registeredNicknames.filter(nickname => {
      return texts.includes(nickname);
    });
  
  }, [texts, registeredNicknames]);
  
  return (
    <Wrap>
      <Form onSubmit={addNickname}>
        <StyledInput ref={nicknameRef} value={nickname} onChangeText={setNickname} placeholder="검색할 가문명을 추가해주세요."/>
        <StyledButton>추가</StyledButton>
      </Form>
      {registeredNicknames.length > 0 && (
        <NicknamesWrap>
          {registeredNicknames.map(nickname => (
            <Nickname key={nickname} nickname={nickname} onDelete={onDelete}/>
          ))}
        </NicknamesWrap>
      )}
      <StyledTextArea ref={textsRef} value={texts} onChangeText={setTexts} placeholder="경품 당첨자 페이지의 전체를 복사해서 붙여넣어주세요."/>
      {matchNicknames.length === 0 ?
        <ResultMessage>일치하는 닉네임이 없습니다.</ResultMessage>
        :
        <ResultMessage>
          당첨된 사용자는 <strong>{matchNicknames.join(', ')}</strong> 입니다.
        </ResultMessage>
      }
    </Wrap>
  );
}

const Wrap = styled.div`
`;

const inputStyles = css`
  border: 1.5px solid ${props => props.theme.main};
  padding: 5px;
`;

const StyledInput = styled(InputText)`
  ${inputStyles};
`;

const StyledTextArea = styled(TextArea)`
  ${inputStyles};
  width: 100%;
  height: 300px;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  ${inputStyles};
`;

const ResultMessage = styled.span`
  > strong {
    font-weight: bold;
    color: ${props => props.theme.main};
  }
`;

const NicknamesWrap = styled.div`
  display: flex;
`;

interface NicknameProp {
  nickname: string;
  onDelete: (nickname: string) => void;
}

function Nickname({nickname, onDelete}: NicknameProp) {
  
  const _onDelete = useCallback(() => {
    onDelete(nickname);
  }, [onDelete, nickname]);
  
  return (
    <NicknameWrap>
      <NicknameText>{nickname}</NicknameText>
      <DeleteButton onClick={_onDelete}>X</DeleteButton>
    </NicknameWrap>
  );
}

const NicknameWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  border: 1px solid ${props => props.theme.main};
  border-radius: 10px;
  
  margin: 10px 5px;
`;

const NicknameText = styled.span`

`;

const DeleteButton = styled.button`
  position: absolute;
  top: 2px;
  right: 5px;
  font-size: 10px;
`;
