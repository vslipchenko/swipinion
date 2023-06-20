export const halfWidthRelativeToViewport = (compareTo: number): number =>
  (window.innerWidth < compareTo ? window.innerWidth : compareTo) / 2;
