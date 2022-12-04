import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {
  ArrayManagerConstructorParameter,
  LocalStorageArrayManager,
  LocalStorageObjectManager,
} from '@util/extend/local-stroage';
import type {PkType} from '@util/extend/core';
import {useEffectFromTheSecondTime} from '@util/hooks/useEffectFromTheSecondTime';

export interface UseLocalStorageObjectManagerOption<V extends Object> {
  enabled?: boolean;
  defaultValue?: V | null;
}

/**
 * @description
 * LocalStorageObjectManager: 단순히 로컬스토리지에 읽고 쓰는것만 도와줍니다.
 * useLocalStorageObjectManager: 로컬스트토리지에 저장된 값이 변할때 화면도 따라 변하는것을 쉽게 구현하도록 도와줍니다.
 */
export function useLocalStorageObjectManager<V extends Object>(manager: LocalStorageObjectManager<V>, option?: UseLocalStorageObjectManagerOption<V>) {
  const {enabled = true, defaultValue = null} = option ?? {};
  const [state, setState] = useState<V | null>(defaultValue);

  useEffect(() => {
    if (enabled) {
      setState(manager.parseItem());
    }
  }, [enabled, manager]);

  useEffectFromTheSecondTime(useCallback(() => {
    if (!enabled) {
      return;
    }

    if (state !== null) {
      manager.setStringifyItem(state);
    }
  }, [enabled, manager, state]));

  return [state, setState] as [V | null, Dispatch<SetStateAction<V>>];
}

/**
 * @description
 * LocalStorageArrayManager: 단순히 로컬스토리지에 읽고 쓰는것만 도와줍니다.
 * useLocalStorageArrayManager: 로컬스트토리지에 저장된 값이 변할때 화면도 따라 변하는것을 쉽게 구현하도록 도와줍니다.
 */
export function useLocalStorageArrayManager<I extends Object, P extends PkType>({key, enableDuplicated, pkExtractor}: ArrayManagerConstructorParameter<I, P>, enabled = true) {
  const manager = useMemo(() => new LocalStorageArrayManager({
    key,
    enableDuplicated,
    pkExtractor

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [key, enableDuplicated]);

  const [state, setState] = useLocalStorageObjectManager(manager, {enabled, defaultValue: []}) as [I[], Dispatch<SetStateAction<I[]>>];

  const appendFirst = useCallback((item: I) => {
    setState(manager.appendFirst(item));
  }, [manager, setState]);

  const appendLast = useCallback((item: I) => {
    setState(manager.appendLast(item));
  }, [manager, setState]);

  const removeByPk = useCallback((pk: P) => {
    setState(manager.removeByPk(pk));
  }, [manager, setState]);

  return {
    list: state,
    appendFirst,
    appendLast,
    removeByPk
  };
}
