import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import type {ModalProp} from '@component/modals/Modal';
import Modal from '@component/modals/Modal';
import Form from '@component/atoms/Form';
import CheckBox from '@component/atoms/CheckBox';
import RadioGroup from '@component/atoms/RadioGroup';
import RadioLabel from '@component/atoms/RadioLabel';
import Button from '@component/atoms/Button';
import InputComputableNumber from '@component/atoms/InputComputableNumber';
import {useAppDispatch, useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';
import {DROUGHTY_FEE_TABLES} from '@util/services/fee';
import {setFeeSettingActionCreator} from '@store/feeSetting';

export type FeeSettingModalProp = Omit<ModalProp, 'children' | 'title' | 'easilyClose'>;

export default function FeeSettingModal(props: FeeSettingModalProp) {
  const feeSetting = useAppSelector(state => state.feeSetting, shallowEqual);
  const [enableValuePackage, setEnableValuePackage] = useState(feeSetting.enableValuePackage);
  const [enableRing, setEnableRing] = useState(feeSetting.enableRing);
  const [eventFee, setEventFee] = useState(feeSetting.eventFee === 0 ? '' : String(feeSetting.eventFee));
  const [droughty, setDroughty] = useState(feeSetting.droughty === 0 ? '' : String(feeSetting.droughty));
  const dispatch = useAppDispatch();

  const save = useCallback(() => {
    dispatch(setFeeSettingActionCreator({
      eventFee: Number(eventFee),
      droughty: Number(droughty),
      enableValuePackage,
      enableRing
    }));
    props.close();
  }, [dispatch, droughty, enableRing, enableValuePackage, eventFee, props]);

  return (
    <Modal title="수수료 설정" {...props}>
      <Wrap>
        <CheckBox onChangeChecked={setEnableValuePackage} checked={enableValuePackage} label="밸류패키지"/>
        <RadioWrap>
          <RadioGroup name="droughty" value={String(droughty)} onChange={setDroughty}>
            {DROUGHTY_FEE_TABLES.map(({value, meaning}) => (
              <RadioLabel key={value} label={meaning} value={String(value)}/>
            ))}
          </RadioGroup>
        </RadioWrap>
        <CheckBox onChangeChecked={setEnableRing} checked={enableRing} label="거상의 반지 or 그믐달 거래 우대권"/>
        <div>
          <InputComputableNumber value={eventFee} onChangeText={setEventFee}/>%
        </div>
        <Button type="submit" onClick={save} className="full">저장</Button>
      </Wrap>
    </Modal>
  );
}

const Wrap = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  > :not(:first-child) {
    margin-top: 20px;
  }
`;

const RadioWrap = styled.div`
  display: flex;
  
  > label:not(:first-child) {
    margin-left: 15px;
  }
`;
