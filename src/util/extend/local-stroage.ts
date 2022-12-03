/**
 * @description 로컬스토리지에 Object를 쉽고 안전하게 읽고 쓰기위해 만들었습니다.
 * 1. 매번 중복되는 코드를 제거하기 위해.
 * 2. localStorage의 key는 문자열이라서 오타로인해 잘못 읽고 쓸 우려가 있어서.
 */
import {PkType, removeDuplicatedObject} from '@util/extend/core';

export class LocalStorageObjectManager<V extends Object> {
  /**
   * @private
   * I think derived classes are need not access the key.
   * Instead, derived classes can use super's methods.
   */
  private readonly key: string;

  constructor(key: string, defaultValue?: V) {
    this.key = key;

    if (defaultValue) {
      try {
        if (!this.getItem()) {
          this.setStringifyItem(defaultValue);
        }
      } catch (error) {
        if (!(error instanceof ReferenceError)) {
          throw error;
        }
      }
    }
  }

  /**
   * @private
   * Instead of this private method, use setStringifyItem().
   */
  private setItem(value: string) {
    localStorage.setItem(this.key, value);
  }

  /**
   * @private
   * Instead of this private method, use parseItem().
   */
  private getItem() {
    return localStorage.getItem(this.key);
  }

  setStringifyItem(value: V) {
    this.setItem(JSON.stringify(value));
  }

  parseItem() {
    const item = this.getItem()
    return item ? JSON.parse(item) as V : null;
  }
}

export interface ArrayManagerConstructorParameter<I extends Object, P extends PkType> {
  key: string;
  pkExtractor: (item: I) => P;
  enableDuplicated: boolean;
}

/**
 * @description 로컬스토리지에 Array를 쉽고 안전하게 읽고 쓰기위해 만들었습니다.
 */
export class LocalStorageArrayManager<I extends Object, P extends PkType> extends LocalStorageObjectManager<I[]> {
  /**
   * @private The pkExtractor must not be accessible in public.
   * And I don't have any plan that makes derived classes extend this class. (= This is the reason that I don't set visibility to protected)
   * For the above two reasons, I set visibility to private.
   */
  private readonly pkExtractor: ArrayManagerConstructorParameter<I, P>['pkExtractor'];
  private readonly enableDuplicated: ArrayManagerConstructorParameter<I, P>['enableDuplicated'];

  constructor({key, enableDuplicated, pkExtractor}: ArrayManagerConstructorParameter<I, P>) {
    super(key);
    this.pkExtractor = pkExtractor;
    this.enableDuplicated = enableDuplicated;
  }

  parseItem(): I[] {
    try {
      const array = super.parseItem();

      if (array === null || !Array.isArray(array)) {
        return [];

      } else {
        return array;
      }
    } catch (error) {
      console.error('An empty array was returned because an error occurred while JSON.parse().', error);
      return [];
    }
  }

  removeByPk(pk: P): I[] {
    const list = this.parseItem().filter(prev => this.pkExtractor(prev) !== pk);
    this.setStringifyItem(list);
    return list;
  }

  appendLast(item: I): I[] {
    const items = [...this.parseItem(), item];
    const list = this.enableDuplicated ? items : removeDuplicatedObject(items, this.pkExtractor);
    this.setStringifyItem(list);
    return list;
  }

  appendFirst(item: I): I[] {
    const items = [item, ...this.parseItem()];
    const list = this.enableDuplicated ? items : removeDuplicatedObject(items, this.pkExtractor);
    this.setStringifyItem(list);
    return list;
  }
}
