import { Component, ViewChild } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';


import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  num: string;
  lst_barcode: Array<string>;
  lst_barcodeToDisplay: Array<string>;
  index: number;
  result: string;

  constructor(private storage: Storage, private barcodeScanner: BarcodeScanner, private recipeService: RecipeService, private http: HttpClient, private nativeHttp: HTTP, private plt: Platform) {
    this.lst_barcode = [];
    this.lst_barcodeToDisplay = [];
    this.index = 0;
    this.loadDataFromStorage();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
      this.addMoreItems();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.lst_barcodeToDisplay.length == 100) {
        event.target.disabled = true;
      }
    }, 800);
  }


  addMoreItems() {
    console.log('global list size', this.lst_barcode.length);
    for (let i = 0; i < 5; ++i) {
      ++this.index;
      if (this.lst_barcode[this.index] == null) {
        --this.index;
        break;
      }
      this.lst_barcodeToDisplay.push(this.lst_barcode[this.index]);
    }
  }


  //==============Scan===================
  scan() {

    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        from(this.recipeService.getDataNativeHttp(barcodeData.text)).pipe(
          finalize(() => console.log("testInsidePipe"))
        ).subscribe(data => {
          console.log('native data' + JSON.stringify(data.data));
          this.num = JSON.parse(data.data);
          this.lst_barcode.unshift(JSON.parse(data.data));
          this.lst_barcodeToDisplay.unshift(JSON.parse(data.data));
          ++this.index;
        }, err => {
          console.log('JS Call error' + err);
        })
      }
    }).catch(err => {
      console.log('Error', err);
    });

  }

  loadDataFromStorage() {
    this.storage.get('lst_barcode').then((val) => {
      this.lst_barcode = val ? val : [];
      for (let i = 0; i < 10; ++i) {
        ++this.index;
        if (this.lst_barcode.length > this.index) {
          this.lst_barcodeToDisplay.push(this.lst_barcode[this.index]);
        }
      }
    });
  }

  scantest() {
    from(this.recipeService.getDataNativeHttp('061314000070')).pipe(
      finalize(() => console.log("testInsidePipe"))
    ).subscribe(data => {
      console.log('native data' + JSON.stringify(data.data));
      this.num = JSON.parse(data.data);
      this.lst_barcode.unshift(JSON.parse(data.data));
      this.lst_barcodeToDisplay.unshift(JSON.parse(data.data));
      ++this.index;
    }, err => {
      console.log('JS Call error' + err);
    })
  }

  clear() {
    this.storage.clear();
    this.lst_barcode = [];
    this.lst_barcodeToDisplay = [];
    console.log("db_clear");
  }
}


