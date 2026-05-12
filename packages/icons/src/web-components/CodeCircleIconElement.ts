/// <reference path="../svg.d.ts" />
import type { TemplateResult } from "lit";
import { defineIconElement, IconElement } from "../icon-element";
import svgSource from "../raw/code_circle.svg";

export class CodeCircleIconElement extends IconElement {
  static readonly tagName = "repo-code-circle-icon";

  protected override renderSvg(): TemplateResult {
    return this.renderSvgSource(svgSource);
  }
}

defineIconElement(CodeCircleIconElement.tagName, CodeCircleIconElement);

declare global {
  interface HTMLElementTagNameMap {
    "repo-code-circle-icon": CodeCircleIconElement;
  }
}
