import { css } from '@emotion/css';
import { injectGlobal } from '@emotion/css';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('graph-node')
class GraphNode extends LitElement {
  @property()
  id = '';
  @property()
  description = '';
  @property()
  isOpen = false;

  handleClick(event: MouseEvent) {
    event.preventDefault();
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.style.zIndex = '1';
    else this.style.zIndex = '';
    this.render();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <span class=${label(this.isOpen)} @click=${this.handleClick}>
        ${this.id}
      </span>
      <div class=${bubbleOuter(this.isOpen)} @click=${this.handleClick}>
        <div class=${bubbleInner(this.isOpen)}>
          <div class=${content(this.isOpen)}>
            ${this.isOpen ? this.description : ''}
          </div>
        </div>
      </div>
    `;
  }
}

injectGlobal`
  graph-node {
    display: inline-flex;
    position: absolute;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
`;

const label = (isOpen: boolean) => css`
  z-index: 1;
  position: absolute;
  top: ${isOpen ? '8px' : '0'};
  left: ${isOpen ? '8px' : '50%'};
  color: ${isOpen && '#cccccc'};
  transform: ${!isOpen && 'translate(-50%, calc(-100% - 4px))'};
  transition: all 300ms ease-in-out;
`;

const content = (isOpen: boolean) => css`
  padding: calc(1em + 16px) 8px 8px;
  opacity: ${isOpen ? 1 : 0};
  transition: all 300ms ease-in-out;
`;

const bubbleOuter = (isOpen: boolean) => css`
  border-radius: 10px;
  border: solid 2px #b3b3b3;
  box-shadow: ${!isOpen && '0 0 8px 4px rgba(255, 255, 255, 0.5)'};
`;

const bubbleInner = (isOpen: boolean) => css`
  width: ${isOpen ? '200px' : '8px'};
  height: ${isOpen ? '150px' : '8px'};
  border-radius: 8px;
  background-color: ${isOpen ? '#282828' : '#ffffff'};
  overflow: hidden;
  transition: all 300ms ease-in-out;
`;

export {};
