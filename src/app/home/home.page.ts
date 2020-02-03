import { Component, ViewChild } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';


import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  num: string;
  products: Array<Object>;
  productsToDisplay: Array<Object>;
  index: number;
  result: string;

  constructor(private storage: Storage, private barcodeScanner: BarcodeScanner, private recipeService: RecipeService) {
    this.products = [];
    this.productsToDisplay = [];
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
      if (this.productsToDisplay.length == 100) {
        event.target.disabled = true;
      }
    }, 800);
  }


  addMoreItems() {
    console.log('global list size', this.products.length);
    for (let i = 0; i < 5; ++i) {
      ++this.index;
      if (this.products[this.index] == null) {
        --this.index;
        break;
      }
      this.productsToDisplay.push(this.products[this.index]);
    }
  }


  //==============Scan===================
  scan() {

    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        from(this.recipeService.getDataNativeHttp(barcodeData.text)).pipe().subscribe(data => {
          this.num = JSON.parse(data.data);
          this.products.unshift(JSON.parse(data.data));
          this.productsToDisplay.unshift(JSON.parse(data.data));
          ++this.index;
          this.storage.set('products',this.products );
        }, err => {
          console.log('JS Call error' + err);
        })
      }
    }).catch(err => {
      console.log('Scanner Error', err);
    });

  }

  loadDataFromStorage() {
    this.storage.get('products').then((val) => {
      this.products = val ? val : [];
      for (let i = 0; i < 5; ++i) {
        ++this.index;
        if (this.products.length > this.index) {
          this.productsToDisplay.push(this.products[this.index]);
        }
      }
      console.log(this.products)
    });
    
  }

  scantest() {
    from(this.recipeService.getDataNativeHttp('061314000070')).pipe(
      finalize(() => console.log("testInsidePipe"))
    ).subscribe(data => {
      console.log('native data' + JSON.stringify(data.data));
      this.num = JSON.parse(data.data);
      this.products.unshift(JSON.parse(data.data));
      this.productsToDisplay.unshift(JSON.parse(data.data));
      ++this.index;
    }, err => {
      console.log('JS Call error' + err);
    })
  }

  clear() {
    this.products = [];
    this.productsToDisplay = [];
    this.storage.clear();
    console.log("db_clear");
  }
}


