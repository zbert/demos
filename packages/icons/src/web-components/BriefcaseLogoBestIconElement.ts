/// <reference path="../svg.d.ts" />
import type { TemplateResult } from "lit";
import { defineIconElement, IconElement } from "../icon-element";
import svgSource from "../raw/briefcase-logo-best.svg";

export class BriefcaseLogoBestIconElement extends IconElement {
  static readonly tagName = "repo-briefcase-logo-best-icon";

  protected override renderSvg(): TemplateResult {
    return this.renderSvgSource(svgSource);
  }
}

defineIconElement(BriefcaseLogoBestIconElement.tagName, BriefcaseLogoBestIconElement);

declare global {
  interface HTMLElementTagNameMap {
    "repo-briefcase-logo-best-icon": BriefcaseLogoBestIconElement;
  }
}
