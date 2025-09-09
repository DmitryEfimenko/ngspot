export function fromInnerHTML(el: Element): string {
  // DEMO: using raw innerHTML. In production, ensure proper sanitization.
  return el.innerHTML;
}

export function fromOuterHTML(el: Element): string {
  // DEMO: using raw outerHTML. In production, ensure proper sanitization.
  return el.outerHTML;
}

export function svg(constantSvg: TemplateStringsArray): string {
  // DEMO: constant SVG string. In production, ensure proper sanitization.
  return constantSvg[0];
}
