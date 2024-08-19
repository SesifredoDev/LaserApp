import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'app-theme';

  constructor() {
    this.loadTheme();
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
  }

  loadTheme() {
    const theme = (localStorage.getItem(this.themeKey) || 'red');
    this.setTheme(theme);
  }
}
