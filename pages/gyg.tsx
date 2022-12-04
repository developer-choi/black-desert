import React, {useCallback} from 'react';
import styled from 'styled-components';
import {BLACK_STONE_ARMOR_BY_1HOUR, GYG_COUNT_BY_1HOUR, gygRevenue,} from '@util/services/gyg';
import {LocalStorageObjectManager} from '@util/extend/local-stroage';
import {numberWithComma} from '@util/extend/core';
import keepRestPrevState from '@util/extend/state';
import {useLocalStorageObjectManager} from '@util/hooks/local-storage';
import Form from '@component/atoms/Form';
import InputComputableNumber from '@component/atoms/InputComputableNumber';
import {H1} from '@component/atoms/heading';
import {useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';
import {FeeFieldSet, Info, StyledFieldSet, StyledLabel} from '@component/atoms/forms';
import Head from 'next/head';

export default function Page() {
  const [state, setState] = useGygManager();
  const feeSetting = useAppSelector(state => state.feeSetting, shallowEqual);

  const onChangeGipaPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['gipaPrice'], {gipaPrice: Number(value)}));
  }, [setState]);

  const setGygPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['gygPrice'], {gygPrice: Number(value)}));
  }, [setState]);

  const setBlackStoneArmorPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['blackStoneArmorPrice'], {blackStoneArmorPrice: Number(value)}));
  }, [setState]);

  if (!state) {
    return null;
  }

  const {gygPrice, gipaPrice, blackStoneArmorPrice} = state;

  const {gipaRevenue, blackStoneArmorRevenue, totalRevenue} = gygRevenue({
    gygPrice: Number(gygPrice),
    gipaPrice: Number(gipaPrice),
    blackStoneArmorPrice: Number(blackStoneArmorPrice),
    feeSetting
  });

  return (
    <>
      <Head>
        <title>고유결 계산기</title>
      </Head>
      <H1>고유결 계산기</H1>
      <StyledForm>
        <StyledFieldSet>
          <StyledLabel>기파 가격</StyledLabel>
          <InputComputableNumber value={String(gipaPrice)} onChangeText={onChangeGipaPrice} enableComma enableDecimal={false}/>
        </StyledFieldSet>

        <StyledFieldSet>
          <StyledLabel>고유결 가격</StyledLabel>
          <InputComputableNumber value={String(gygPrice)} onChangeText={setGygPrice} enableComma enableDecimal={false}/>
        </StyledFieldSet>

        <StyledFieldSet>
          <StyledLabel>블방 가격</StyledLabel>
          <InputComputableNumber value={String(blackStoneArmorPrice)} onChangeText={setBlackStoneArmorPrice} enableComma enableDecimal={false}/>
        </StyledFieldSet>

        <FeeFieldSet/>
      </StyledForm>

      <div>
        <Info>1시간 기파수익 : <em>{numberWithComma(gipaRevenue)}</em></Info>
        <Info>1시간 블방수익 : <em>{numberWithComma(blackStoneArmorRevenue)}</em></Info>
        <Info>1시간 총수익 : <em>{numberWithComma(totalRevenue)}</em></Info>
      </div>

      <div>
        <Info className="mt-10"># 모두 팔고 거래소 수수료 뗀 수익입니다.</Info>
        <Info># 고유결을 1시간동안 {GYG_COUNT_BY_1HOUR}개 깐다고 가정합니다. (조합시간 제외)</Info>
        <Info># 고유결 {GYG_COUNT_BY_1HOUR}개 까서 기파가 {GYG_COUNT_BY_1HOUR}개 나왔다고 가정합니다.</Info>
        <Info># 1시간동안 나온 사냥꾼의 인장이 약 {BLACK_STONE_ARMOR_BY_1HOUR * 2}개, 이를 블방으로 바꿨다고 가정합니다.</Info>
      </div>
    </>
  );
}

interface GygManager {
  gygPrice: number;
  gipaPrice: number;
  blackStoneArmorPrice: number;
}

const GYG_MANAGER = new LocalStorageObjectManager<GygManager>('gyg', {
  gipaPrice: 3000000,
  gygPrice: 1600000,
  blackStoneArmorPrice: 150000
});

function useGygManager() {
  return useLocalStorageObjectManager(GYG_MANAGER);
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;
