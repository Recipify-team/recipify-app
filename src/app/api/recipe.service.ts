import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  url = 'http://165.227.49.166:3000/product/';
  data:string;
  // public product = new Observable<any>();
  constructor(private http: HttpClient, private nativeHttp: HTTP, private plt: Platform) { }

  // public product = new Observable<any>();

  /**
  * Get the detailed information for an ID using the "i" parameter
  * 
  * @param {string} barcode imdbID to retrieve information
  * @returns Observable with detailed information
  */
  async getDataStandars(barcode) {
    const url = this.url + barcode;

    this.http.get(url).pipe(
      finalize(() => console.log("testInsidePipe"))
    )
      .subscribe(data => {
        this.data = data['result'];
      }, err => {
        console.log('JS Call error' + err);
      })
  }

  async getDataNativeHttp(barcode) {
    const url = this.url + barcode;

    let nativeCall = this.nativeHttp.get(url, {}, {
      'Content-Type': 'application/json'
    });
    return nativeCall;
  }
  getDataEverywhere(barcode) {
    this.plt.is('cordova') ? this.getDataNativeHttp(barcode) : this.getDataStandars(barcode);
  }

}