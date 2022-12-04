import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import Form from '@component/atoms/Form';
import InputText from '@component/atoms/InputText';
import TextArea from '@component/atoms/TextArea';
import {H1} from '@component/atoms/heading';
import Button from '@component/atoms/Button';
import {useLocalStorageArrayManager} from '@util/hooks/local-storage';
import Image from 'next/image';

export default function Page() {

  const [nickname, setNickname] = useState('');
  const [texts, setTexts] = useState('');
  const {list: registeredNicknames, appendLast, removeByPk} = useRegisteredNicknamesManager();

  const addNickname = useCallback(() => {
    appendLast({nickname});
    setNickname('');
  }, [appendLast, nickname]);
  
  const onDelete = useCallback((toDeleteNickname: string) => {
    removeByPk(toDeleteNickname);
  }, [removeByPk]);
  
  const matchNicknames = useMemo(() => {
    return registeredNicknames.filter(({nickname}) => {
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
    <>
      <H1>검사데이 당첨확인</H1>
      <StyledForm onSubmit={addNickname}>
        <InputText value={nickname} onChangeText={setNickname} placeholder="가문명 추가"/>
        <Button>추가</Button>
      </StyledForm>
      {registeredNicknames.length > 0 && (
        <NicknamesWrap>
          {registeredNicknames.map(({nickname}) => (
            <Nickname key={nickname} nickname={nickname} onDelete={onDelete}/>
          ))}
        </NicknamesWrap>
      )}
      <TextArea autoFocus value={texts} onChangeText={setTexts} placeholder="경품 당첨자 페이지의 전체를 복사해서 붙여넣어주세요."/>
      {!message ? null : <ResultMessage dangerouslySetInnerHTML={{__html: message}}/>}
    </>
  );
}

interface User {
  nickname: string;
}

function useRegisteredNicknamesManager() {
  return useLocalStorageArrayManager({
    key: 'registeredNicknames', 
    pkExtractor: (user: User) => user.nickname, 
    enableDuplicated: false
  });
}

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
      <DeleteButton onClick={_onDelete}>
        <Image src="/close.png" alt="close" width={20} height={20}/>
      </DeleteButton>
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
  top: 0;
  right: 0;
`;
