import type { IconElementConstructor } from "./types";

const fallbackHTMLElement = class {} as typeof HTMLElement;
const svgNamespace = "http://www.w3.org/2000/svg";

const reflectedSvgAttributes = [
  "aria-hidden",
  "aria-label",
  "aria-labelledby",
  "focusable",
  "height",
  "role",
  "width"
];

const styles = `
  <style>
    :host {
      display: inline-block;
      line-height: 0;
      color: inherit;
      vertical-align: middle;
    }

    :host([hidden]) {
      display: none;
    }

    svg {
      display: block;
    }
  </style>
`;

function getHTMLElementConstructor() {
  return typeof globalThis.HTMLElement === "undefined"
    ? fallbackHTMLElement
    : globalThis.HTMLElement;
}

export function createIconElement(svgContent: string): IconElementConstructor {
  const BaseHTMLElement = getHTMLElementConstructor();

  return class IconElement extends BaseHTMLElement {
    static get observedAttributes() {
      return ["title", ...reflectedSvgAttributes];
    }

    #root: ShadowRoot | null = null;

    constructor() {
      super();

      if (typeof this.attachShadow === "function") {
        this.#root = this.attachShadow({ mode: "open" });
      }
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    private render() {
      if (!this.#root) {
        return;
      }

      this.#root.innerHTML = `${styles}${svgContent}`;

      const svg = this.#root.querySelector("svg");
      if (!svg) {
        return;
      }

      svg.setAttribute("part", "svg");

      for (const attribute of reflectedSvgAttributes) {
        const value = this.getAttribute(attribute);

        if (value === null) {
          svg.removeAttribute(attribute);
        } else {
          svg.setAttribute(attribute, value);
        }
      }

      const title = this.getAttribute("title");
      if (title) {
        const titleElement = document.createElementNS(svgNamespace, "title");
        const titleId = `${this.localName}-title`;

        titleElement.id = titleId;
        titleElement.textContent = title;

        svg.prepend(titleElement);
        svg.setAttribute("aria-labelledby", titleId);
        svg.setAttribute("role", this.getAttribute("role") ?? "img");
        svg.removeAttribute("aria-hidden");
      }
    }
  };
}

export function defineIconElement(tagName: string, elementConstructor: CustomElementConstructor) {
  if (typeof globalThis.customElements === "undefined") {
    return;
  }

  if (!globalThis.customElements.get(tagName)) {
    globalThis.customElements.define(tagName, elementConstructor);
  }
}
