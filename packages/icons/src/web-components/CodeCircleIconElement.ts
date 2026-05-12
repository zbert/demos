import { createIconElement, defineIconElement } from "../icon-element";

const svg = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"96\" height=\"96\" viewBox=\"0 0 96 96\">\n  <circle cx=\"48\" cy=\"48\" r=\"34\" fill=\"#000000\"/>\n  <path d=\"M39 39 30 48 39 57\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M57 39 66 48 57 57\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n  <path d=\"M52 34 44 62\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"4\" stroke-linecap=\"round\"/>\n</svg>";

export class CodeCircleIconElement extends createIconElement(svg) {}

export const codeCircleIconTagName = "repo-icon-code-circle";

defineIconElement(codeCircleIconTagName, CodeCircleIconElement);

export default CodeCircleIconElement;
