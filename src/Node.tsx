import React, { FocusEventHandler, useEffect, useRef, useState } from 'react';
import { injectGlobal, css } from '@emotion/css';
import { SizeTransition } from './SizeTransition';
import { NodeData } from './types';
import { when } from './utils';

interface NodeProps {
  id: string;
  index: number;
  host: HTMLElement;
  data: NodeData;
}

export default function Node({ index, data, host }: NodeProps) {
  const { name, description } = data;
  const [isOpen, setIsOpen] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const canBeOpened = !!description;

  useEffect(() => {
    host.style.zIndex = isOpen ? '1' : '';
  }, [isOpen]);

  const open = () => canBeOpened && setIsOpen(true);
  const blurred = (event: React.FocusEvent<HTMLDivElement>) => {
    const clickedInside = focusRef.current?.contains(
      event.relatedTarget as Node | null
    );
    if (clickedInside) return;
    setIsOpen(false);
  };

  return (
    <>
      <span className={label(isOpen)} onClick={open}>
        {name}
      </span>
      <div
        ref={focusRef}
        tabIndex={when(canBeOpened) && index}
        className={bubbleOuter(isOpen)}
        onClick={open}
        onBlur={blurred}
      >
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
    </>
  );
}

injectGlobal`
  node {
    display: inline-flex;
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
    
    a, a:hover, a:active, a:visited {
      color: inherit;
    }
  }
`;

const transition = css`
  transition: all 300ms ease-in;
`;

const label = (isOpen: boolean) => css`
  z-index: 1;
  position: absolute;
  top: ${isOpen ? '12px' : '0'};
  left: ${isOpen ? '12px' : '50%'};
  color: ${isOpen && '#cccccc'};
  transform: ${!isOpen && 'translate(-50%, calc(-100% - 4px))'};
  transition: all 300ms ease-out;
`;

const content = (isOpen: boolean) => css`
  width: 200px;
  padding: calc(1em + 16px) 8px 8px;
  opacity: ${isOpen ? 1 : 0};
  ${transition}
`;

const bubbleOuter = (isOpen: boolean) => css`
  &:focus {
    //outline: none;
  }
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
