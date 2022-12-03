import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import Form from '@component/atoms/Form';
import InputText from '@component/atoms/InputText';
import TextArea from '@component/atoms/TextArea';
import {removeDuplicatedItems} from '@util/extend/core';
import {H1} from '@component/atoms/heading';
import Button from '@component/atoms/Button';

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

  const message = texts.length === 0 ?
    null
    :
    matchNicknames.length === 0 ?
      '일치하는 닉네임이 없습니다.'
      :
      `당첨된 사용자는 <em>${matchNicknames.join(', ')}</em> 입니다.`;
  
  return (
    <Wrap>
      <H1>검사데이 당첨확인</H1>
      <StyledForm onSubmit={addNickname}>
        <InputText ref={nicknameRef} value={nickname} onChangeText={setNickname} placeholder="가문명 추가"/>
        <Button>추가</Button>
      </StyledForm>
      {registeredNicknames.length > 0 && (
        <NicknamesWrap>
          {registeredNicknames.map(nickname => (
            <Nickname key={nickname} nickname={nickname} onDelete={onDelete}/>
          ))}
        </NicknamesWrap>
      )}
      <TextArea ref={textsRef} value={texts} onChangeText={setTexts} placeholder="경품 당첨자 페이지의 전체를 복사해서 붙여넣어주세요."/>
      {!message ? null : <ResultMessage dangerouslySetInnerHTML={{__html: message}}/>}
    </Wrap>
  );
}

const Wrap = styled.div`
  > :not(h1) {
    margin-bottom: 15px;
  }
`;

const StyledForm = styled(Form)`
  display: flex;
  
  > button {
    margin-left: 10px;
  }
`;

const ResultMessage = styled.span`
  > em {
    font-weight: bold;
    color: ${props => props.theme.main};
  }
`;

const NicknamesWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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
  border: 2px solid ${props => props.theme.main};
  border-radius: 10px;
  white-space: normal;
  min-width: 100px;
`;

const NicknameText = styled.span`

`;

const DeleteButton = styled.button`
  position: absolute;
  top: 2px;
  right: 5px;
  font-size: 12px;
  font-weight: bold;
`;
