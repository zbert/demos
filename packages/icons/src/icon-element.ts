import {
  LitElement,
  css,
  html,
  type PropertyValues,
  type TemplateResult
} from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";

export abstract class IconElement extends LitElement {
  static override properties = {
    title: { attribute: false, noAccessor: true },
    size: { type: String, reflect: true }
  };

  static override styles = css`
    :host {
      color: inherit;
      display: inline-block;
      line-height: 0;
      vertical-align: middle;
    }

    :host([size]) {
      height: var(--icon-size);
      width: var(--icon-size);
    }

    svg {
      display: block;
    }

    :host([size]) svg {
      height: 100%;
      width: 100%;
    }
  `;

  declare size: string;

  private svgTitle = "";

  constructor() {
    super();
    this.size = "";
    this.title = "";
  }

  override get title() {
    return this.svgTitle;
  }

  override set title(value: string) {
    const oldValue = this.svgTitle;
    this.svgTitle = value ?? "";
    this.requestUpdate("title", oldValue);
  }

  override connectedCallback() {
    super.connectedCallback();
    this.syncSize();
  }

  protected override firstUpdated() {
    this.syncSvgTitle();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("size")) {
      this.syncSize();
    }

    if (changedProperties.has("title")) {
      this.syncSvgTitle();
    }
  }

  protected override render(): TemplateResult {
    return this.renderSvg();
  }

  protected abstract renderSvg(): TemplateResult;

  protected renderSvgSource(svgSource: string): TemplateResult {
    return html`${unsafeSVG(svgSource)}`;
  }

  private syncSize() {
    if (!this.size) {
      this.style.removeProperty("--icon-size");
      return;
    }

    this.style.setProperty("--icon-size", formatIconSize(this.size));
  }

  private syncSvgTitle() {
    const svgElement = this.renderRoot.querySelector("svg");

    if (!svgElement) {
      return;
    }

    const titleElement = getOrCreateTitleElement(svgElement);
    titleElement.textContent = this.title;
  }
}

export function defineIconElement(
  tagName: string,
  elementClass: CustomElementConstructor
) {
  if (typeof customElements !== "undefined" && !customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}

function formatIconSize(size: string) {
  return /^\d+(\.\d+)?$/.test(size) ? `${size}px` : size;
}

function getOrCreateTitleElement(svgElement: SVGSVGElement) {
  const titleElement = Array.from(svgElement.children).find(
    (element) => element.localName === "title"
  );

  if (titleElement instanceof SVGTitleElement) {
    return titleElement;
  }

  const newTitleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "title"
  );
  svgElement.insertBefore(newTitleElement, svgElement.firstChild);

  return newTitleElement;
}
