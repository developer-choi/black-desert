import React, {useCallback} from 'react';
import styled from 'styled-components';
import {
  BLACK_STONE_ARMOR_BY_1HOUR,
  DROUGHTY_REVENUE_TABLES,
  GYG_COUNT_BY_1HOUR, gygRevenue,
} from '@util/extend/gyg';
import {LocalStorageObjectManager} from '@util/extend/local-stroage';
import {numberWithComma} from '@util/extend/core';
import keepRestPrevState from '@util/extend/state';
import {useLocalStorageObjectManager} from '@util/hooks/local-storage';
import RadioGroup from '@component/atoms/RadioGroup';
import Form from '@component/atoms/Form';
import InputComputableNumber from '@component/atoms/InputComputableNumber';
import RadioLabel from '@component/atoms/RadioLabel';

export default function Page() {
  const [state, setState] = useGygManager();

  const onChangeGipaPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['gipaPrice'], {gipaPrice: Number(value)}));
  }, [setState]);

  const setGygPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['gygPrice'], {gygPrice: Number(value)}));
  }, [setState]);

  const setBlackStoneArmorPrice = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['blackStoneArmorPrice'], {blackStoneArmorPrice: Number(value)}));
  }, [setState]);

  const onChangeDroughty = useCallback((value: string) => {
    setState(prevState => keepRestPrevState(prevState, ['droughty'], {droughty: Number(value)}));
  }, [setState]);

  if (!state) {
    return null;
  }

  const {gygPrice, gipaPrice, blackStoneArmorPrice, droughty} = state;

  const {gipaRevenue, blackStoneArmorRevenue, totalRevenue} = gygRevenue({
    gygPrice: Number(gygPrice),
    gipaPrice: Number(gipaPrice),
    droughty,
    blackStoneArmorPrice: Number(blackStoneArmorPrice)
  });
  
  return (
    <StyledForm>
      <StyledFieldSet>
        <StyledLabel>기파 가격</StyledLabel>
        <StyledInput value={String(gipaPrice)} onChangeText={onChangeGipaPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>
      
      <StyledFieldSet>
        <StyledLabel>고유결 가격</StyledLabel>
        <StyledInput value={String(gygPrice)} onChangeText={setGygPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>
      
      <StyledFieldSet>
        <StyledLabel>블방 가격</StyledLabel>
        <StyledInput value={String(blackStoneArmorPrice)} onChangeText={setBlackStoneArmorPrice} enableComma enableDecimal={false}/>
      </StyledFieldSet>
      
      <StyledFieldSet>
        <StyledLabel>가문명성</StyledLabel>
        <RadioGroup name="droughty" value={String(droughty)} onChange={onChangeDroughty}>
          {DROUGHTY_REVENUE_TABLES.map(({value, meaning}) => (
            <CustomRadio key={value} label={meaning} value={String(value)}/>
          ))}
        </RadioGroup>
      </StyledFieldSet>
      
      <Info>1시간 기파수익 : <b>{numberWithComma(gipaRevenue)}</b></Info>
      <Info>1시간 블방수익 : <b>{numberWithComma(blackStoneArmorRevenue)}</b></Info>
      <Info>1시간 총수익 : <b>{numberWithComma(totalRevenue)}</b></Info>
      
      <Info># 밸류패키지 포함 가격입니다.</Info>
      <Info># 기파, 블랙스톤 방어구를 모두 팔았을 때 거래소 수수료 뗀 수익입니다.</Info>
      <Info># 고유결을 1시간동안 {GYG_COUNT_BY_1HOUR}개 깐다고 가정합니다.</Info>
      <Info># 고유결 {GYG_COUNT_BY_1HOUR}개 까서 기파가 {GYG_COUNT_BY_1HOUR}개 나왔다고 가정합니다.</Info>
      <Info># 1시간동안 나온 사냥꾼의 인장이 약 {BLACK_STONE_ARMOR_BY_1HOUR * 2}개, 이를 블방으로 바꿨을 때 {BLACK_STONE_ARMOR_BY_1HOUR}개라고 가정합니다.</Info>
      <Info># 블랙스톤 방어구는 모두 팔았을 때를 기준으로 가정합니다.</Info>
    </StyledForm>
  );
}

interface GygManager {
  gygPrice: number;
  droughty: number;
  gipaPrice: number;
  blackStoneArmorPrice: number;
}

const GYG_MANAGER = new LocalStorageObjectManager<GygManager>('gyg', {
  gipaPrice: 3000000,
  gygPrice: 1600000,
  droughty: 999,
  blackStoneArmorPrice: 150000
});

function useGygManager() {
  return useLocalStorageObjectManager(GYG_MANAGER);
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.span`
  width: 100px;
`;

const StyledFieldSet = styled.fieldset`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  :last-of-type {
    margin-bottom: 50px;
  }
`;

const StyledInput = styled(InputComputableNumber)`
  padding: 5px;
  border: 2px solid ${props => props.theme.main};
`;

const CustomRadio = styled(RadioLabel)`
  margin-right: 10px;
`;

const Info = styled.span`
  margin-bottom: 10px;
  
  > b {
    color: ${props => props.theme.main};
  }
`;
