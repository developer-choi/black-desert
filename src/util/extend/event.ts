import type {BaseSyntheticEvent} from 'react';

export function preventDefault(event: BaseSyntheticEvent) {
  event.preventDefault();
}
