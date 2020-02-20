import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Storage, IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt'
import{AuthGuardService}from './services/auth-guard.service'
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:8100']
  }
}
export class HammerConfig extends HammerGestureConfig {
  overrides = {
      pan: {
          direction: 6
      },
      pinch: {
          enable: false
      },
      rotate: {
          enable: false
      }
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(),
    AppRoutingModule, HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [Storage],
      }
    })],
  providers: [
    AuthGuardService,
    StatusBar,
    BarcodeScanner,
    SplashScreen,
    ScreenOrientation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HTTP,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
  },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }