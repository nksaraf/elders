import React, {DOMElement} from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  callback: (event: WindowEventMap[K]) => any,
  element = window as Window | HTMLElement | null,
  options: boolean | AddEventListenerOptions = false
) {
  const savedCallback = React.useRef<any>(callback);
  savedCallback.current = callback;

  React.useEffect(() => {
    if (!element) return;

    const eventListener = (event: any) => savedCallback.current?.(event);

    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}
