import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

enum State {
  None = 'None',
  Closed = 'Closed',
  Closing = 'Closing',
  Opening = 'Opening',
  Open = 'Open',
  AboutToClose = 'AboutToClose',
}

@customElement('size-transition')
class SizeTransition extends LitElement {
  static get styles() {
    return css`
      size-transition {
        display: block;
        transition: width, height 300ms ease-in-out;
      }
    `;
  }

  @property()
  in = false;

  @state()
  state = State.None;

  connectedCallback() {
    this.state = this.in ? State.Open : State.Closed;
    this.addEventListener('transitionend', this.transitionEnded);
  }

  disconnectedCallback() {
    this.removeEventListener('transitionend', this.transitionEnded);
  }

  transitionEnded(event: TransitionEvent) {
    if (event.target !== this) return;

    if (this.state === State.Opening) {
      this.state = State.Open;
    }

    if (this.state === State.Closing) {
      this.state = State.Closed;
    }
  }

  setSize() {
    const { width, height } = this.stateToSize();
    const addPx = (num?: number) => (num === undefined ? '' : `${num}px`);
    this.style.width = addPx(width);
    this.style.height = addPx(height);
  }

  stateToSize() {
    switch (this.state) {
      case State.Opening:
      case State.AboutToClose:
        return this.getCurrentSize();
      case State.Closing:
      case State.Closed:
        return { width: 0, height: 0 };
      case State.None:
      case State.Open:
        return { width: undefined, height: undefined };
    }
  }

  getCurrentSize = () => ({
    width: this.scrollWidth,
    height: this.scrollHeight,
  });

  firstUpdated() {
    console.log('debug firstUpdated, line 78:', 0);
  }

  updated(changedProperties: any) {
    super.updated(changedProperties);
    console.log('debug updated, line 78:', this.in, changedProperties);
    if (this.state === State.AboutToClose) {
      requestAnimationFrame(() => {
        this.state = State.Closing;
      });

      return this.setSize();
    }

    if (this.state === State.None && this.in) {
      this.state = State.Open;
    }

    if (this.state === State.None && !this.in) {
      this.state = State.Closed;
    }

    if (this.state === State.Closed && this.in) {
      this.state = State.Opening;
    }

    if (this.state === State.Open && !this.in) {
      this.state = State.AboutToClose;
    }

    if (this.state === State.Opening && !this.in) {
      this.state = State.Closed;
    }

    this.setSize();
  }

  render() {
    return html`<slot></slot>`;
  }
}
