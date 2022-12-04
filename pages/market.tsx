import {H1} from '@component/atoms/heading';
import React, {useState} from 'react';
import InputComputableNumber from '@component/atoms/InputComputableNumber';
import {FeeFieldSet, StyledFieldSet, StyledLabel} from '@component/atoms/forms';
import {getBreakEven, getCapitalGains} from '@util/services/market';
import {useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';
import {numberWithComma} from '@util/extend/core';

export default function Page() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const feeSetting = useAppSelector(state => state.feeSetting, shallowEqual);
  const breakEven = getBreakEven({buyPrice: Number(buyPrice), feeSetting});
  const {value: capitalGain, stateText, state} = getCapitalGains({buyPrice: Number(buyPrice), sellPrice: Number(sellPrice), standard: STANDARD_PRICE, feeSetting})

  return (
    <>
      <H1>거래소 사재기 계산기</H1>
      <StyledFieldSet>
        <StyledLabel>개당 구매 가격</StyledLabel>
        <InputComputableNumber value={buyPrice} onChangeText={setBuyPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>

      <StyledFieldSet>
        <StyledLabel>개당 판매 가격</StyledLabel>
        <InputComputableNumber value={sellPrice} onChangeText={setSellPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>

      <FeeFieldSet/>

      {buyPrice.length === 0 ? null : (
        <StyledFieldSet>
          <StyledLabel>손익 분기</StyledLabel>
          <span><em>{numberWithComma(breakEven)}</em>은화 이상 팔아야 수익이 발생합니다.</span>
        </StyledFieldSet>
      )}

      {!(buyPrice.length > 0 && sellPrice.length > 0) ? null : (
        <StyledFieldSet>
          <StyledLabel>차익 계산</StyledLabel>
          <span className="distance">{numberWithComma(STANDARD_PRICE)}은화당</span>
          <span className="distance"><em className={state}>{numberWithComma(capitalGain)}</em>은화의</span>
          <span><em className={state}>{stateText}</em> 발생합니다.</span>
        </StyledFieldSet>
      )}
    </>
  );
}

const STANDARD_PRICE = 100000000; //1억
