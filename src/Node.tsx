import React, { useEffect, useRef, useState } from 'react';
import { css, injectGlobal } from '@emotion/css';
import { scaleLinear } from 'd3-scale';
import { color as d3Color } from 'd3-color';

import { SizeTransition } from './SizeTransition';
import { NodeData } from './types';
import { when } from './utils';

interface NodeProps {
  id: string;
  index: number;
  host: HTMLElement;
  data?: NodeData;
  isLeafNode?: boolean;
  level?: number;
  depth?: number;
}

const hoverTimeBeforeOpening = 700;
const minimumTimeToLeaveOpen = 1000;

/**
 * Pure visualization of a node component, shouldn't hold any graph logic but receives every needed data
 */
export default function Node({
  index,
  host,
  isLeafNode,
  level = 0,
  depth = 0,
  data = { name: '', description: '' },
}: NodeProps) {
  const { name, description } = data;
  const [isOpen, setIsOpen] = useState(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(0);
  const canBeClosed = useRef<Promise<void>>();
  const canBeOpened = !!description;

  const color = scaleLinear<string>()
    .domain([0, depth / 2, depth])
    .range([
      d3Color('#2C3F6B')!.brighter(2.5).toString(),
      '#A6A2DC',
      '#FFACAC',
    ])(level);

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
  };

  return (
    <div
      className={node(isOpen, !!isLeafNode)}
      ref={focusRef}
      tabIndex={when(canBeOpened) && index}
      onBlur={blurred}
      onKeyDown={keyPressed}
    >
      <span
        className={label(canBeOpened, isOpen)}
        onMouseEnter={mouseEntered}
        onMouseLeave={mouseLeft}
      >
        {name}
      </span>
      <div className={bubbleOuter(color, isOpen)}>
        <div className={bubbleInner(color, isOpen)}>
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

const diameter = 10;

injectGlobal`
  node {
    display: inline-flex;
    position: absolute;
    transform: translate(-50%, -50%);
  }
`;

const node = (isOpen: boolean, isLeafNode: boolean) => css`
  a,
  a:hover,
  a:active,
  a:visited {
    color: inherit;
  }
  cursor: ${!isOpen && !isLeafNode && 'pointer'};
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
  cursor: ${canBeOpened && !isOpen ? 'help' : 'default'};
`;

const content = (isOpen: boolean) => css`
  width: 200px;
  padding: calc(1em + 16px) 8px 8px;
  opacity: ${isOpen ? 1 : 0};
  ${transition}
`;

const bubbleOuter = (color: string, isOpen: boolean) => {
  const glow = d3Color(color)?.brighter();
  const light = d3Color(color);
  light!.opacity = 0.7;
  glow!.opacity = 0.5;
  const borderWidth = 2;
  return css`
    border-radius: ${diameter + borderWidth}px;
    border: solid ${borderWidth}px ${light + ''};
    box-shadow: ${!isOpen && `0 0 8px 4px ${glow}`};
    ${transition}
  `;
};

const bubbleInner = (color: string, isOpen: boolean) => css`
  padding: ${diameter / 2}px;
  border-radius: ${diameter}px;
  background-color: ${isOpen ? '#282828' : color};
  overflow: hidden;
  ${transition}
`;

export {};
