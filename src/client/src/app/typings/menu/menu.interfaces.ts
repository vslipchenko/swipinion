import {ThemePalette} from '@angular/material/core';

export interface MenuItem {
  title: string;
  icon?: string;
  color?: ThemePalette;
  routerLink?: string;
  items?: Array<MenuItem>; // Used by nested menus
  click?: () => void;
}
