import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from '@firebase/app';

  

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, IonicModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule {}
