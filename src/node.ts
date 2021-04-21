class GraphNode extends HTMLElement {
  connectedCallback() {
    this.innerText = 'node';
  }
}

customElements.define('graph-node', GraphNode);

export {};
