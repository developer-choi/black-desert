import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import TextArea from '@component/atoms/TextArea';
import {removeDuplicatedItems} from '@util/extend/core';
import Button from '@component/atoms/Button';
import {H1} from '@component/atoms/heading';
import InputText from '@component/atoms/InputText';
import Form from '@component/atoms/Form';
import Head from 'next/head';

export default function Page() {
  const [value, setValue] = useState('');
  const [content, setContent] = useState('');
  const coupons = useMemo(() => parser(content), [content]);

  const onClickCopyToCode = useCallback(() => {
    navigator.clipboard.writeText(createCode(coupons));
    toast.info('복사되었습니다.');
  }, [coupons]);

  const onAddDirectly = useCallback(() => {
    if (value.length !== 19) {
      toast.error('쿠폰번호는 공백 또는 하이픈(-) 포함 19자리만 가능합니다.');
      return;
    }

    setValue('');
    setContent(prevState => `${value.replaceAll(' ', '-')}\n${prevState}`);
  }, [value]);

  return (
    <>
      <Head>
        <title>쿠폰 일괄 전송</title>
      </Head>
      <H1>쿠폰 일괄 전송</H1>
      <DirectForm onSubmit={onAddDirectly}>
        <InputText value={value} onChangeText={setValue} placeholder="1AAA  2BBB  3CCC  4DDD" maxLength={19}/>
        <Button type="submit">직접추가</Button>
      </DirectForm>
      <TextArea placeholder="검은사막 쿠폰번호가 포함된 웹페이지 전체를 복사붙여넣기 해주세요. AAAA-AAAA-AAAA-AAAA 형식만 가능하며, 공백형식은 위에서 직접추가 해주세요." value={content} onChangeText={setContent}/>
      {coupons.length === 0 ?
        content.length === 0 ? null : <p>파싱결과 쿠폰이 존재하지않습니다.</p>
        :
        <div>
          <H2>쿠폰번호 ({coupons.length}개)</H2>
          <ul>
            {coupons.map(coupon => (
              <li key={coupon}>{coupon}</li>
            ))}
          </ul>
          <ButtonWrap>
            <Button onClick={onClickCopyToCode}>쿠폰번호 전송코드 복사</Button>
            <Button as="a" target="_blank" href="https://payment.kr.playblackdesert.com/Shop/Coupon">쿠폰번호 입력하러가기</Button>
          </ButtonWrap>
        </div>
      }
      <CouponGuide/>
    </>
  );
}

function CouponGuide() {
  const clickToNewTab = useCallback((src: string) => {
    window.open(src);
  }, []);

  return (
    <>
      <H2 className="mt-50">가이드</H2>
      <div>
        {guides.map(({img, description, title}) => (
          <Guide key={title}>
            <Title>{title}</Title>
            <img src={img} alt="가이드" width="1200" onClick={() => clickToNewTab(img)}/>
            <Description dangerouslySetInnerHTML={{__html: description}}/>
          </Guide>
        ))}
      </div>

      <H2>주의사항</H2>
      {warnings.map(warning => (
        <Warning key={warning} dangerouslySetInnerHTML={{__html: warning}}/>
      ))}
    </>
  );
}

const Guide = styled.div`
  img {
    cursor: pointer;
  }
  
  margin-bottom: 34px;
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

const Warning = styled.p`
  color: red;
  
  em {
    font-style: italic;
    font-weight: bold;
    font-size: 18px;
    margin-right: 3px;
  }
`;

const guides: {title: string, description: string, img: string}[] = [
  {title: '1. 웹페이지 전체 복사하기', description: '쿠폰번호가 있는 웹페이지에서 <em>Ctrl+A</em>로 웹페이지 텍스트 전체를 선택 후 <em>Ctrl+C</em>로 복사합니다.', img: '/coupon1.png'},
  {title: '2. 쿠폰 전송코드 얻기', description: '복사한 웹페이지 내용을 입력박스에 <em>Ctrl+V</em>로 붙여넣은 후, 하단의 <em>쿠폰번호 전송코드복사</em> 버튼을 클릭합니다.', img: '/coupon2.png'},
  {title: '3. 개발자 도구 열기', description: `검은사막 쿠폰번호 입력페이지로 이동하여 개발자도구(윈도우: <em>F12</em>)를 열고 <em>Console탭</em>을 선택하여 <em>Ctrl+V</em>를 통해 복사된 쿠폰번호 전송코드를 붙여넣습니다.`, img: '/coupon3.png'},
  {title: '4. 쿠폰 전송코드 실행하기', description: `<em>엔터</em>를 칠 경우, 코드가 실행되며, <em>코드 하단에 메시지</em>가 출력됩니다.`, img: '/coupon4.png'},
  {title: '5. 웹 창고로 아이템 이동하기', description: `모든 쿠폰번호가 전송될 경우, <em>자동으로 웹창고 페이지로 이동</em>됩니다.`, img: '/coupon5.png'},
];

const warnings: string[] = [
  '개발자 도구 콘솔에서 <em>신뢰할 수 없는 코드</em>를 절대로 실행하지 마세요. <em>원래는 보안상 굉장히 위험한 행동</em>입니다.',
  '<em>중복</em>된 쿠폰번호를 <em>10개</em>이상 전송을 시도할 경우, 펄어비스에서 <em>1시간</em>동안 쿠폰번호 입력을 <em>제한</em>하고 있습니다.',
  '그러므로 한번에 10개이상의 쿠폰번호를 전송하는 경우, 제한을 당하지 않도록 신경써주시기 바랍니다.',
  '해당 코드를 <em>악의적</em>으로 사용할 경우 문제가 생길 수 있습니다. (예시: 코드를 조작하여 <em>수십만개의</em> 쿠폰번호를 한번에 전송하려고 시도하는 경우)',
];

const DirectForm = styled(Form)`
  display: flex;
  
  > button {
    margin-left: 10px;
  }
`;

const H2 = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
  
  &.mt-50 {
    margin-top: 50px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  column-gap: 10px;
  margin-top: 10px;
`;

function createCode(coupons: string[]) {
  return `
let couponLength = 0;
let respondCount = 0;

function reqListener (event) {
  console.log(event.target.responseText);
  respondCount++;
  
  if(respondCount === couponLength) {
    location.href = 'https://www.kr.playblackdesert.com/MyPage/WebItemStorage';
  }
}

function sendCoupon(coupons) {
  couponLength = coupons.length;

  coupons.forEach(coupon => {
    const [first, second, third, fourth] = coupon.split('-');
    let formData = new FormData();
    formData.set('_couponCode1', first);
    formData.set('_couponCode2', second);
    formData.set('_couponCode3', third);
    formData.set('_couponCode4', fourth);
  
    let oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "https://payment.kr.playblackdesert.com/Shop/Coupon/SetCouponProcess");
    oReq.send(formData);
  });
}

function main() {
  let coupons = [${coupons.map(coupon => `'${coupon}'`).join(',')}];
  sendCoupon(coupons);
}

main();
`;
}

function cleanText(text: string) {
  return text.trim().replace(/(\r,\t)/g, '');
}

function parser(text: string) {
  if (text.length === 0) {
    return [];
  }

  const result = text.split('\n').map(string => cleanText(string).split(' ')).flat().filter(value => {
    if (value.length !== 19) {
      return false;
    }

    return value.split('-').length === 4;
  });

  if (result.length === 0) {
    return [];
  }

  return removeDuplicatedItems(result);
}
