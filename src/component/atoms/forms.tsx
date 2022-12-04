import styled from 'styled-components';
import Button from '@component/atoms/Button';
import Image from 'next/image';
import React from 'react';
import FeeSettingModal from '@component/modals/FeeSettingModal';
import FeeInfoModal from '@component/modals/FeeInfoModal';
import useToggle from '@util/hooks/useToggle';
import {getFee} from '@util/services/fee';
import {useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';

export const StyledLabel = styled.span`
  width: 120px;
`;

export const StyledFieldSet = styled.fieldset`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  :last-of-type {
    margin-bottom: 20px;
  }
  
  .small {
    margin-left: 5px;
  }
  
  em {
    font-weight: bold;
    color: ${props => props.theme.main};
  }
  
  .negative {
    color: red;
  }
  
  .positive {
    color: blue;
  }

  .distance {
    margin-right: 5px;
  }
`;

export function FeeFieldSet() {
  const {value: visibleFeeSetting, setFalse: closeFeeSetting, setTrue: openFeeSetting} = useToggle(false);
  const {value: visibleFeeInfo, setFalse: closeFeeInfo, setTrue: openFeeInfo} = useToggle(false);
  const feeSetting = useAppSelector(state => state.feeSetting, shallowEqual);
  const fee = getFee(feeSetting);

  return (
    <>
      <StyledFieldSet>
        <StyledLabel>수수료</StyledLabel>
        <span>{fee}</span>
        <Button className="small orange" onClick={openFeeSetting}>
          <Image src="/edit.png" alt="수정" width={16} height={16}/>
          수정
        </Button>
        <Button className="small blue" onClick={openFeeInfo}>
          <Image src="/info.png" alt="정보" width={16} height={16}/>
          정보
        </Button>
      </StyledFieldSet>
      <FeeSettingModal visible={visibleFeeSetting} close={closeFeeSetting}/>
      <FeeInfoModal visible={visibleFeeInfo} close={closeFeeInfo}/>
    </>
  );
}
