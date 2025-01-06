import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../../../app.config';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-language',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  public languages = [
    {
      name: 'ENG',
      code: 'en',
    },
    {
      name: 'SPA',
      code: 'sp',
    },
    {
      name: 'ARABIC',
      code: 'ar',
    },
    {
      name: 'HINDI',
      code: 'hindi',
    },
    {
      name: 'CHINESE',
      code: 'ch',
    },
  ];

  public selectedLang: string;

  constructor(
    private translate: TranslateService
  ) {
    this.selectedLang = localStorage.getItem('language') || 'en';
  }

  getLanguage(event: Event) {
    this.selectedLang = (event.target as HTMLInputElement).value;
    localStorage.setItem('language', (event.target as HTMLInputElement).value)
    this.translate.use((event.target as HTMLInputElement).value)
  }
}
