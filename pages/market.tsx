import {H1} from '@component/atoms/heading';
import React, {useState} from 'react';
import InputComputableNumber from '@component/atoms/InputComputableNumber';
import {FeeFieldSet, Info, StyledFieldSet, StyledLabel} from '@component/atoms/forms';
import {getBreakEven, getCapitalGains, getExpectedRecivePrice} from '@util/services/market';
import {useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';
import {numberWithComma} from '@util/extend/core';
import Head from 'next/head';

export default function Page() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const feeSetting = useAppSelector(state => state.feeSetting, shallowEqual);

  const breakEven = getBreakEven({buyPrice: Number(buyPrice), feeSetting});
  const sellResultPrice = getExpectedRecivePrice(Number(sellPrice), feeSetting);
  const {value: capitalGain, stateText, state} = getCapitalGains({buyPrice: Number(buyPrice), sellPrice: Number(sellPrice), standard: STANDARD_PRICE, feeSetting})

  return (
    <>
      <Head>
        <title>거래소 계산기</title>
      </Head>
      <H1>거래소 계산기</H1>
      <StyledFieldSet>
        <StyledLabel>구매 가격</StyledLabel>
        <InputComputableNumber placeholder="100,000,000" value={buyPrice} onChangeText={setBuyPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>

      <StyledFieldSet>
        <StyledLabel>판매 가격</StyledLabel>
        <InputComputableNumber placeholder="100,000,000" value={sellPrice} onChangeText={setSellPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>

      <FeeFieldSet/>

      <div>
        {buyPrice.length === 0 ? null : (
          <Info># 손익분기: <em>{numberWithComma(breakEven)}</em> 은화</Info>
        )}

        {sellPrice.length === 0 ? null : (
          <Info># 판매 수령액: <em>{numberWithComma(sellResultPrice)}</em> 은화</Info>
        )}

        {!(buyPrice.length > 0 && sellPrice.length > 0) ? null : (
          <Info>
            # <span className="distance">{numberWithComma(STANDARD_PRICE)}은화당</span>
            <span className="distance"><em className={state}>{numberWithComma(capitalGain)}</em>은화의</span>
            <em className={state}>{stateText}</em> 발생합니다.
          </Info>
        )}
      </div>
    </>
  );
}

const STANDARD_PRICE = 100000000; //1억
