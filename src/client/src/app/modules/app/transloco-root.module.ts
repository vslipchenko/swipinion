// import {HttpClient} from '@angular/common/http';
// import {
//   TRANSLOCO_LOADER,
//   Translation,
//   TranslocoLoader,
//   TRANSLOCO_CONFIG,
//   translocoConfig,
//   TranslocoModule,
//   TranslocoConfig,
// } from '@ngneat/transloco';
// import {Injectable, NgModule} from '@angular/core';
// import {environment} from '~environments/environment';
// import {Observable} from 'rxjs';
// import {TranslocoLoaderData} from '@ngneat/transloco/lib/transloco.loader';
//
// @Injectable({providedIn: 'root'})
// export class TranslocoHttpLoader implements TranslocoLoader {
//   public constructor(private readonly http: HttpClient) {}
//
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   public getTranslation(langPath: string, data: TranslocoLoaderData): Observable<Translation> {
//     // if (!data?.scope) return of({}); // Ignore loading /assets/i18n/ root translations (scope is undefined in such case)
//     return this.http.get<Translation>(`../assets/i18n/${langPath}.json`);
//   }
// }
//
// @NgModule({
//   exports: [TranslocoModule],
//   providers: [
//     {
//       provide: TRANSLOCO_CONFIG,
//       useFactory: translocoConfigFactory,
//       deps: [AuthenticationService, LanguageService],
//     },
//     {provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader},
//   ],
// })
// export class TranslocoRootModule {}
//
// function translocoConfigFactory(
//   authenticationService: AuthenticationService,
//   languageService: LanguageService,
// ): TranslocoConfig {
//   return translocoConfig({
//     availableLangs: LANGUAGES,
//     defaultLang: languageService.resolveLanguage(authenticationService.getAccessTokenData()?.language),
//     prodMode: environment.production,
//   });
// }
