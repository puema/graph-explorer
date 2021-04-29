import React, { useEffect, useRef, useState } from 'react';
import { injectGlobal, css } from '@emotion/css';
import { SizeTransition } from './SizeTransition';

export default function Node({ id, description, host }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    host.style.zIndex = isOpen ? '1' : '';
  }, [isOpen]);

  useEffect(() => {
    const blurred = () => {
      setIsOpen(false);
    };

    focusRef.current!.setAttribute('contentEditable', 'true');
    focusRef.current!.setAttribute('contentEditable', 'true');
    focusRef.current!.addEventListener('blur', blurred);

    return () => {
      focusRef.current!.setAttribute('contentEditable', '');
      focusRef.current!.removeEventListener('blur', blurred);
    };
  });

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <span className={label(isOpen)} onClick={handleClick}>
        {id}
      </span>
      <div ref={focusRef} className={bubbleOuter(isOpen)} onClick={handleClick}>
        <div className={bubbleInner(isOpen)}>
          <SizeTransition in={isOpen}>
            <div className={content(isOpen)}>
              <span>{description}</span>
            </div>
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
  }
`;

const transition = css`
  transition: all 300ms ease-in-out;
`;

const label = (isOpen: boolean) => css`
  z-index: 1;
  position: absolute;
  top: ${isOpen ? '12px' : '0'};
  left: ${isOpen ? '12px' : '50%'};
  color: ${isOpen && '#cccccc'};
  transform: ${!isOpen && 'translate(-50%, calc(-100% - 4px))'};
  transition: all 400ms ease-in-out;
`;

const content = (isOpen: boolean) => css`
  width: 200px;
  padding: calc(1em + 16px) 8px 8px;
  opacity: ${isOpen ? 1 : 0};
  ${transition}
`;

const bubbleOuter = (isOpen: boolean) => css`
  &:focus {
    outline: none;
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
