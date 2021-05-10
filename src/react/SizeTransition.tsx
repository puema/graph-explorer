import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { css, cx } from '@emotion/css';

export interface SizeTransitionProps {
  in: boolean;
  className?: string;
  collapsedSize?: Size;
  children: ReactNode;
}

interface Size {
  height: number;
  width: number;
}

enum State {
  Initial = 'Initial',
  Open = 'Open',
  Closed = 'Closed',
  Closing = 'Closing',
  AboutToClose = 'AboutToClose',
  Opening = 'Opening',
}

export const SizeTransition = ({
  children,
  className,
  in: isVisible,
  collapsedSize,
}: SizeTransitionProps) => {
  const [state, setState] = useState(State.Initial);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === State.AboutToClose) {
      requestAnimationFrame(() => {
        setState(State.Closing);
      });
      return;
    }

    setState((state) => {
      if (state === State.Initial && isVisible) {
        return State.Open;
      }

      if (state === State.Initial && !isVisible) {
        return State.Closed;
      }

      if (state === State.Closed && isVisible) {
        return State.Opening;
      }

      if (state === State.Open && !isVisible) {
        return State.AboutToClose;
      }

      if (state === State.Opening && !isVisible) {
        return State.Closed;
      }

      return state;
    });
  }, [state, isVisible]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>
  ) => {
    if (event.target !== ref.current) return;

    if (state === State.Opening) {
      setState(State.Open);
    }
    if (state === State.Closing) {
      setState(State.Closed);
    }
  };

  const getCurrentSize = () => {
    const { current: element } = ref;
    if (!element) return;
    return { width: element.scrollWidth, height: element.scrollHeight };
  };

  const stateToSize = () => {
    switch (state) {
      case State.Opening:
      case State.AboutToClose:
        return getCurrentSize();
      case State.Closing:
      case State.Closed:
        return collapsedSize || { width: 0, height: 0 };
      case State.Initial:
      case State.Open:
        return;
    }
  };

  return (
    <div
      className={cx(className, root)}
      style={stateToSize()}
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
    >
      {children}
    </div>
  );
};

const root = css`
  overflow: hidden;
  transition: all 300ms ease;
`;
