import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  num: string;

  constructor(private barcodeScanner: BarcodeScanner) { }

  scan(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.num = barcodeData.text;
    }).catch(err => {
        console.log('Error', err);
    });
  }

}


