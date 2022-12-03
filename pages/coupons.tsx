import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import TextArea from '@component/atoms/TextArea';
import {removeDuplicatedItems} from '@util/extend/core';
import Button from '@component/atoms/Button';
import {H1} from '@component/atoms/heading';
import InputText from '@component/atoms/InputText';
import Form from '@component/atoms/Form';

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
      <H1>쿠폰 일괄 전송</H1>
      <DirectForm onSubmit={onAddDirectly}>
        <InputText value={value} onChangeText={setValue} placeholder="AAAA AAAA AAAA AAAA" maxLength={19}/>
        <Button type="submit">직접추가</Button>
      </DirectForm>
      <TextArea placeholder="검은사막 쿠폰번호가 포함된 웹페이지 전체를 복사붙여넣기 해주세요. AAAA-AAAA-AAAA-AAAA 형식만 가능하며, 공백구분은 위의 버튼으로 직접 추가하세요." value={content} onChangeText={setContent}/>
      {coupons.length === 0 ?
        content.length === 0 ? null : '파싱결과 쿠폰이 존재하지않습니다.'
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
    </>
  );
}

const DirectForm = styled(Form)`
  display: flex;
  
  > button {
    margin-left: 10px;
  }
`;

const H2 = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
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
