import type {BaseSyntheticEvent} from 'react';

export function preventDefault(event: BaseSyntheticEvent) {
  event.preventDefault();
}

export function stopPropagation(event: BaseSyntheticEvent) {
  event.stopPropagation();
}
