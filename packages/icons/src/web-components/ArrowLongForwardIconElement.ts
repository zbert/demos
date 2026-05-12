/// <reference path="../svg.d.ts" />
import type { TemplateResult } from "lit";
import { defineIconElement, IconElement } from "../icon-element";
import svgSource from "../raw/arrow_long_forward.svg";

export class ArrowLongForwardIconElement extends IconElement {
  static readonly tagName = "repo-arrow-long-forward-icon";

  protected override renderSvg(): TemplateResult {
    return this.renderSvgSource(svgSource);
  }
}

defineIconElement(ArrowLongForwardIconElement.tagName, ArrowLongForwardIconElement);

declare global {
  interface HTMLElementTagNameMap {
    "repo-arrow-long-forward-icon": ArrowLongForwardIconElement;
  }
}
