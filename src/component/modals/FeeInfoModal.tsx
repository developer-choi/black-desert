import React, {useMemo} from 'react';
import styled from 'styled-components';
import type {ModalProp} from '@component/modals/Modal';
import Modal from '@component/modals/Modal';
import {useAppSelector} from '@store/storeHooks';
import {shallowEqual} from 'react-redux';
import {
  BASIC_FEE,
  DEFAULT_FEE_LABEL,
  FeeLabel,
  FIEF_FEE_LABEL,
  getDroughtyFee,
  getFee,
  RING_FEE_LABEL,
  VALUE_PACKAGE_FEE_LABEL
} from '@util/services/fee';
import Decimal from 'decimal.js';

export type FeeSettingModalProp = Omit<ModalProp, 'children' | 'title' | 'easilyClose'>;

export default function FeeInfoModal(props: FeeSettingModalProp) {
  const {eventFee, droughty, enableRing, enableValuePackage} = useAppSelector(state => state.feeSetting, shallowEqual);
  const labels: FeeLabel[] = useMemo(() => {
    const array = [DEFAULT_FEE_LABEL, FIEF_FEE_LABEL];

    if (enableValuePackage) {
      array.push(VALUE_PACKAGE_FEE_LABEL);
    }

    array.push(new FeeLabel(getDroughtyFee(droughty), '가문명성'));

    if (enableRing) {
      array.push(RING_FEE_LABEL);
    }

    if (eventFee > 0) {
      array.push(new FeeLabel(eventFee, '이벤트 수수료'));
    }

    return array;
  }, [droughty, enableRing, enableValuePackage, eventFee]);

  const [, , ...rest] = labels;

  const basicLabel = new FeeLabel(new Decimal(1).minus(BASIC_FEE).toNumber(), '기본 수수료 총합');

  const total = rest.reduce((a, b) => {
    a.percent = a.percent + b.percent;
    a.fee = a.fee + b.fee;
    return a;
  }, {fee: 0, percent: 0});

  const resultFee = getFee({eventFee, droughty, enableRing, enableValuePackage});

  return (
    <Modal easilyClose title="수수료 정보" {...props}>
      <Wrap>
        <ol>
          {labels.map(({percent, name}, index) => (
            <li key={name}>{index + 1}. {name} {percent}%</li>
          ))}
        </ol>
        <span>{basicLabel.name} <em>{basicLabel.percent}%</em></span>
        <span>수령액 증가 총합 <em>{total.percent}%</em></span>
        <span>수수료 결과 = (1 - {basicLabel.fee}) x {total.fee} = <em>{resultFee}</em></span>
      </Wrap>
    </Modal>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  > :not(:first-child) {
    margin-top: 20px;
  }
  
  em {
    color: ${props => props.theme.main};
    font-weight: bold;
  }
`;
