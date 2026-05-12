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
    title: { type: String, reflect: true },
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
  declare title: string;

  private generatedAriaLabel = false;

  constructor() {
    super();
    this.size = "";
    this.title = "";
  }

  override connectedCallback() {
    super.connectedCallback();
    this.syncSize();
    this.syncAccessibility();
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("size")) {
      this.syncSize();
    }

    if (changedProperties.has("title")) {
      this.syncAccessibility();
    }
  }

  protected override render(): TemplateResult {
    return this.renderSvg();
  }

  protected abstract renderSvg(): TemplateResult;

  protected renderSvgSource(svgSource: string): TemplateResult {
    return html`${unsafeSVG(injectTitle(svgSource, this.title))}`;
  }

  private syncAccessibility() {
    const hasExplicitLabel =
      this.hasAttribute("aria-label") || this.hasAttribute("aria-labelledby");

    if (this.title) {
      if (!hasExplicitLabel || this.generatedAriaLabel) {
        this.setAttribute("aria-label", this.title);
        this.generatedAriaLabel = true;
      }

      if (!this.hasAttribute("role")) {
        this.setAttribute("role", "img");
      }

      this.removeAttribute("aria-hidden");
      return;
    }

    if (this.generatedAriaLabel) {
      this.removeAttribute("aria-label");
      this.generatedAriaLabel = false;
    }

    if (!hasExplicitLabel) {
      this.setAttribute("aria-hidden", "true");
    }
  }

  private syncSize() {
    if (!this.size) {
      this.style.removeProperty("--icon-size");
      return;
    }

    this.style.setProperty("--icon-size", formatIconSize(this.size));
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

function injectTitle(svgSource: string, title: string) {
  if (!title) {
    return svgSource;
  }

  const svgMatch = svgSource.match(/<svg\b[^>]*>/i);

  if (!svgMatch || svgMatch.index === undefined) {
    return svgSource;
  }

  const openTagEnd = svgMatch.index + svgMatch[0].length;
  return `${svgSource.slice(0, openTagEnd)}<title>${escapeHtml(title)}</title>${svgSource.slice(openTagEnd)}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
