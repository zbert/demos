export type IconElementConstructor = CustomElementConstructor & {
  new (): HTMLElement;
};

export type IconManifestItem = {
  name: string;
  className: string;
  tagName: string;
  sourceFile: string;
};
