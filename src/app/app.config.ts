import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { ToastrModule } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { cabState } from './shared/store/state/cab.state';
import { driverState } from './shared/store/state/driver.state';
import { routes } from './app.routes';
import { DatePipe } from '@angular/common';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // provideNgxMask({
    //   dropSpecialCharacters: true, // Removes special characters like parentheses and dashes
    //   validation: true,            // Enables validation
    // }),
    // provideNgbModule(),
    importProvidersFrom([ // used for root
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      ToastrModule.forRoot(),
      // NgbModule,
      AngularSvgIconModule.forRoot(),
      NgxsModule.forRoot([cabState, driverState]),
      DatePipe
    ])
  ]
};
