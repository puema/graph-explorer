import { css } from '@emotion/css';
import { injectGlobal } from '@emotion/css';

class GraphNode extends HTMLElement {
  clicked = 1;

  static get observedAttributes() {
    return ['data-id'];
  }

  connectedCallback() {
    this.id = 'GraphNode';
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  handleClick() {
    this.clicked++;
    this.render();
  }

  render() {
    this.innerHTML = `
      <span class=${label}>${this.getAttribute('data-id')}</span>
      <div class=${bubbleOuter} onclick="${this.id}.handleClick()">
        <div class=${bubbleInner(this.clicked)}></div>
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

const label = css`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(-100% - 4px));
`;

const bubbleOuter = css`
  border-radius: 100%;
  border: solid 2px #b3b3b3;
  box-shadow: 0 0 8px 4px rgba(255, 255, 255, 0.5);
`;

const bubbleInner = (clicked: number) => css`
  width: ${clicked * 8}px;
  height: ${clicked * 8}px;
  border-radius: 100%;
  background-color: #ffffff;
`;

customElements.define('graph-node', GraphNode);

export {};
