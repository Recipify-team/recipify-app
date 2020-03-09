import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private authService: AuthService,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      this.statusBar.styleBlackOpaque();
      //this.statusBar.backgroundColorByHexString('#10dc60');
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
     
      this.storage.get('tutorialDone').then((val) => {
        if(!(val==true)){
          //TO CHANEG this.router.navigate(['tutorial']);
        }
      });
      this.authService.authenticationState.subscribe(state => {
        //console.log(state)
        // if (state) {
        //   this.router.navigate(['inside']);
        // } else {
        //   this.router.navigate(['home']);
        // }
      });
    });
  }
}
