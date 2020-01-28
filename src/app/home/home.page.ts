import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  num: string;
  lst_barcode: Array<string>;

  constructor(private storage: Storage,private barcodeScanner: BarcodeScanner) {
    this.lst_barcode = [];
    this.refresh();
   }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.num = barcodeData.text;
      this.lst_barcode.push(this.num);
      this.storage.set("lst_barcode", this.lst_barcode);
    }).catch(err => {
        console.log('Error', err);
    });
  }

  refresh(){
    // Or to get a key/value pair
    this.storage.get('lst_barcode').then((val) => {
      this.lst_barcode = val ? val : [];
    });
  }

  scantest(){
      this.num = '844815687';
      this.lst_barcode.push(this.num);
      this.storage.set("lst_barcode", this.lst_barcode);
      console.log(this.lst_barcode);
  }
  clear(){
    this.storage.clear();
    this.lst_barcode = [];
    console.log(this.lst_barcode);
  }
}


