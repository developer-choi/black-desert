export type KeyboardEventSpecialKey = 'ctrlKey' | 'altKey' | 'metaKey' | 'shiftKey';
const SPECIAL_KEYS: KeyboardEventSpecialKey[] = ['shiftKey', 'metaKey', 'ctrlKey', 'altKey'];

/**
 * React.KeyboardEvent와 window.addEventListener에서 전달되는 KeyboardEvent에서 모두 사용해도 타입에러가 안나도록
 * React.KeyboardEvent와 typescript lib에 있는 KeyboardEvent중에 필요한 property만 모았습니다.
 */
export type MinimumKeyboardEvent = Pick<KeyboardEvent, 'key' | KeyboardEventSpecialKey>;
export type MinimumSpecialKeyEvent = Record<KeyboardEventSpecialKey, boolean>;

export interface MatchKeyboardEvent {
  key: string;
  specialKeys?: KeyboardEventSpecialKey[];
}

/**
 * @param event KeyboardEvent (ex: React.KeyboardEvent or KeyboardEvent (typescript lib)
 * @param matchTarget 사용자가 누른 키와 특수키
 * @example (event, {key: 'A', matchKeys: ['ctrlKey']}) ==> 사용자가 Control Key를 누른 상태로 (= 다른 metaKey, altKey, shiftKey는 누르지않은상태로) 같은 key를 눌러야만 true가 반환됩니다.
 * @example (event, {key: 'Delete'}) ==> 사용자가 어떠한 특수키 (ctrlKey, altKey, metaKey, shiftKey)를 동시에 같이 누르지 않은 상태에서 Delete키 딱 하나만 눌렀을 떄에만 true가 반환됩니다.
 */
export function isMatchKeyboardEvent(event: MinimumKeyboardEvent, matchTarget: MatchKeyboardEvent) {
  if (event.key.toLowerCase() !== matchTarget.key.toLowerCase()) {
    return false;
  }
  
  return isMatchSpecialKey(event, matchTarget.specialKeys ?? []);
}

export function isMatchSpecialKey(event: MinimumSpecialKeyEvent, matchKeys: KeyboardEventSpecialKey[]) {
  const restKeys = SPECIAL_KEYS.filter(key => !matchKeys.includes(key));
  return matchKeys.every(key => event[key]) && restKeys.every(key => !event[key]);
}

/**
 * 현재 포커스가 document.body인 상태에서 길이가 존재하는 키를 입력했는지 아닌지를 체크.
 * Ctrl Insert 같은 <input>에 입력했을 때 길이가 존재하지않는 특수키가 아니라, 'a' 같이 길이가 존재하는 키인지를 체크.
 */
export function isSomeKeyEnteredInWindow(windowKeyDownEvent: KeyboardEvent) {
  const {activeElement, body} = document;
  
  if (activeElement !== body) {
    return false;
  }
  
  const {key, ctrlKey, altKey, metaKey, shiftKey} = windowKeyDownEvent;
  
  if (ctrlKey || altKey || metaKey || shiftKey) {
    return false;
  }
  
  /**
   * 'Enter', 'ArrowUp' 같은 특수키는 꼭 길이가 1보다 컸고, 'ㅁ'같은 한글은 포커스가 document.body에 있을 때 입력할 경우 'a'로 입력이 됬었음.
   * 그러므로 길이가 1인걸로 체크하는것으로 결정했습니다.
   */
  return key.length === 1;
}
