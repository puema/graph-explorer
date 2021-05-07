import React, { FocusEventHandler, useEffect, useRef, useState } from 'react';
import { injectGlobal, css } from '@emotion/css';
import { SizeTransition } from './SizeTransition';
import { NodeData } from './types';
import { when } from './utils';

interface NodeProps {
  id: string;
  index: number;
  host: HTMLElement;
  data?: NodeData;
}

const hoverTimeBeforeOpening = 700;
const minimumTimeToLeaveOpen = 1000;

export default function Node({
  index,
  host,
  data = { name: '', description: '' },
}: NodeProps) {
  const { name, description } = data;
  const [isOpen, setIsOpen] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(0);
  const canBeClosed = useRef<Promise<void>>();
  const canBeOpened = !!description;

  useEffect(() => {
    host.style.zIndex = isOpen ? '1' : '';
  }, [isOpen]);

  const open = () => canBeOpened && setIsOpen(true);
  const close = async () => {
    await canBeClosed.current;
    setIsOpen(false);
  };

  const blurred = (event: React.FocusEvent<HTMLDivElement>) => {
    const clickedInside = focusRef.current?.contains(
      event.relatedTarget as Node | null
    );
    if (clickedInside) return;
    setIsOpen(false);
  };

  const keyPressed = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      if (!isOpen) open();
      if (isOpen) close();
    }
    if (event.key === 'Escape') close();
  };

  const mouseEntered = () => {
    // Clear any previously triggered opening
    window.clearTimeout(enteredRef.current);
    // Only open while hovering for some time
    enteredRef.current = window.setTimeout(() => {
      open();
      focusRef.current!.focus();
      // Keep it open for some minimum time to avoid flickering open state
      canBeClosed.current = new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, minimumTimeToLeaveOpen);
      });
    }, hoverTimeBeforeOpening);
  };

  const mouseLeft = () => {
    // Clear any previously triggered opening to not open it at all,
    // when the mouse was moved out again fast enough
    window.clearTimeout(enteredRef.current);
    // close();
  };

  return (
    <div className={node}>
      <span
        className={label(canBeOpened, isOpen)}
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
        ref={focusRef}
        tabIndex={when(canBeOpened) && index}
        onFocus={open}
        onBlur={blurred}
      >
        {name}
      </span>
      <div className={bubbleOuter(isOpen)}>
        <div className={bubbleInner(isOpen)}>
          <SizeTransition in={isOpen}>
            {description && (
              <div className={content(isOpen)}>
                <span dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}
          </SizeTransition>
        </div>
      </div>
    </div>
  );
}

injectGlobal`
  node {
    display: inline-flex;
    position: absolute;
    transform: translate(-50%, -50%);
  }
`;

const node = css`
  a,
  a:hover,
  a:active,
  a:visited {
    color: inherit;
  }
`;

const transition = css`
  transition: all 300ms ease-in;
`;

const label = (canBeOpened: boolean, isOpen: boolean) => css`
  &:focus {
    outline: none;
  }
  z-index: 1;
  position: absolute;
  top: ${isOpen ? '12px' : '0'};
  left: ${isOpen ? '12px' : '50%'};
  color: ${isOpen && '#cccccc'};
  transform: ${!isOpen && 'translate(-50%, calc(-100% - 4px))'};
  transition: all 300ms ease-out;
  cursor: ${canBeOpened ? 'help' : 'default'};
`;

const content = (isOpen: boolean) => css`
  width: 200px;
  padding: calc(1em + 16px) 8px 8px;
  opacity: ${isOpen ? 1 : 0};
  ${transition}
`;

const bubbleOuter = (isOpen: boolean) => css`
  border-radius: 10px;
  border: solid 2px #b3b3b3;
  box-shadow: ${!isOpen && '0 0 8px 4px rgba(255, 255, 255, 0.5)'};
  ${transition}
`;

const bubbleInner = (isOpen: boolean) => css`
  padding: 4px;
  border-radius: 8px;
  background-color: ${isOpen ? '#282828' : '#ffffff'};
  overflow: hidden;
  ${transition}
`;

export {};
