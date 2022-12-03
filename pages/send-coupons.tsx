import React, {useCallback, useMemo, useState, ClipboardEvent} from 'react';
import styled from 'styled-components';
import {toast} from 'react-toastify';
import TextArea from '@component/atoms/TextArea';
import {removeDuplicatedItems} from '@util/extend/core';
import Button from '@component/atoms/Button';

export default function Page() {

  const [value, setValue] = useState('');
  const coupons = useMemo(() => parser(value), [value]);

  const onPaste = useCallback((event: ClipboardEvent<HTMLTextAreaElement>) => {
    const data = event.clipboardData.getData('text');
    setValue(data);
  }, []);

  const sendCoupon = useCallback(() => {
    navigator.clipboard.writeText(`
    
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

`);
    toast.info('복사되었습니다.');
  }, [coupons]);

  return (
    <Wrap>
      <StyledTextArea placeholder="검은사막 쿠폰번호를 복사붙여넣기 해주세요." value={value} onPaste={onPaste}/>
      {coupons.length > 0 &&
      <div>
        <H2>쿠폰번호 ({coupons.length}개)</H2>
        <ul>
          {coupons.map(coupon => (
            <li key={coupon}>{coupon}</li>
          ))}
        </ul>
        <ButtonWrap>
          <Button onClick={sendCoupon}>쿠폰번호 전송코드 복사</Button>
          <Button as="a" target="_blank" href="https://payment.kr.playblackdesert.com/Shop/Coupon">쿠폰번호 입력하러가기</Button>
        </ButtonWrap>
      </div>
      }
    </Wrap>
  );
}

const Wrap = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  
  li {
    line-height: 1.2;
  }
`;

const H2 = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const StyledTextArea = styled(TextArea)`
  width: 100%;
  height: 400px;
  border: 1px solid ${props => props.theme.main};
  padding: 10px;
  margin-bottom: 20px;
`;

const ButtonWrap = styled.div`
  display: flex;
  column-gap: 10px;
  margin-top: 10px;
`;

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
    alert('쿠폰번호 파싱결과 쿠폰이 존재하지않음.');
  }

  return removeDuplicatedItems(result);
}
