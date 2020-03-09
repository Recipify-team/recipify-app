import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

import { FwfButtonComponent } from '../components/fwf-button/fwf-button.component';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { FavoritePage } from '../pages/favorite/favorite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    SuperTabsModule,
    
  ],entryComponents:[FavoritePage],
  declarations: [HomePage, FwfButtonComponent,FavoritePage]
})
export class HomePageModule {}
