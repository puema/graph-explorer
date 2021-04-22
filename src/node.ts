import { css } from '@emotion/css';
import { injectGlobal } from '@emotion/css';

class GraphNode extends HTMLElement {
  static get observedAttributes() {
    return ['data-id'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <span class=${label}>${this.getAttribute('data-id')}</span>
      <div class=${bubbleOuter}>
        <div class=${bubbleInner}></div>
      </div>
    `;
  }
}

injectGlobal`
  graph-node {
    display: inline-flex;
    position: relative;
    margin: 32px;
  }
`;

const label = css`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%);
`;

const bubbleOuter = css`
  border-radius: 100%;
  border: solid 2px #b3b3b3;
`;

const bubbleInner = css`
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #ffffff;
`;

customElements.define('graph-node', GraphNode);

export {};
