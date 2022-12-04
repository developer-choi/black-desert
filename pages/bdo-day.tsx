import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import Form from '@component/atoms/Form';
import InputText from '@component/atoms/InputText';
import TextArea from '@component/atoms/TextArea';
import {H1, H2} from '@component/atoms/heading';
import Button from '@component/atoms/Button';
import {useLocalStorageArrayManager} from '@util/hooks/local-storage';
import Image from 'next/image';
import Head from 'next/head';
import Guide, {GuideProp} from '@component/molecules/Guide';

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
      `당첨된 사용자는 <em>${matchNicknames.map(({nickname}) => nickname).join(', ')}</em> 입니다.`;

  return (
    <>
      <Head>
        <title>검사데이 당첨확인</title>
      </Head>
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
      <TextArea autoFocus value={texts} onChangeText={setTexts} placeholder="검사데이 당첨자 페이지의 전체를 복사해서 붙여넣어주세요."/>
      {!message ? null : <ResultMessage dangerouslySetInnerHTML={{__html: message}}/>}

      <H2 className="mt-50">가이드</H2>
      {guides.map(({img, description, title}) => (
        <Guide key={title} title={title} description={description} img={img}/>
      ))}
    </>
  );
}

const guides: GuideProp[] = [
  {title: '1. 가문명 추가하기', description: '당첨확인을 하고싶은 가문명을 입력하세요. (본인, 지인 등등) 입력된 값은 해당 컴퓨터의 브라우저에 저장됩니다.', img: '/bdo-day-guide1.png'},
  {title: '2. 웹페이지 전체 복사하기', description: '당첨자가 있는 웹페이지에서 <em>Ctrl+A</em>로 웹페이지 텍스트 전체를 선택 후 <em>Ctrl+C</em>로 복사합니다.', img: '/bdo-day-guide2.png'},
  {title: '3. 입력박스에 붙여넣기', description: '복사한 내용을 입력박스에 <em>Ctrl+V</em>로 붙여넣습니다.', img: '/bdo-day-guide3.png'},
];

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

const ResultMessage = styled.p`
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
        <Image src="/close.png" alt="close" width={18} height={18}/>
      </DeleteButton>
    </NicknameWrap>
  );
}

const NicknameWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
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
