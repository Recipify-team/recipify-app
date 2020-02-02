import { Component, ViewChild } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';


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
  data: string;

  constructor(private storage: Storage, private barcodeScanner: BarcodeScanner, private recipeService: RecipeService) {
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
        this.num = barcodeData.text;

        this.lst_barcode.unshift(this.num);
        this.lst_barcodeToDisplay.unshift(this.num);
        ++this.index;
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
    this.num = '844815687' + this.index;
    this.recipeService.getData(743434009477);

    this.recipeService.result.subscribe( (data) => 
    {
    this.data = data.results;
    // this.dataLoaded = true;
    console.log(data.results)
  
    }
    );
    
    console.log("data DEBUGCUSTOM",this.data);

    this.lst_barcode.unshift(this.num);
    this.lst_barcodeToDisplay.unshift(this.num);
    ++this.index;
    console.log(this.num+ " added");
  }
  clear() {
    this.storage.clear();
    this.lst_barcode = [];
    this.lst_barcodeToDisplay = [];
    console.log("db_clear");
  }
}


