import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';


@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  productUrl = 'http://165.227.49.166:3000/product/';
  recipeUrl = 'http://165.227.49.166:3000/recipe/?product=';
  data:string;

  constructor(private nativeHttp: HTTP) { }

  /**
  * Get the detailed information for an ID using the "i" parameter
  * 
  * @param {string} barcode imdbID to retrieve information
  * @returns Observable with detailed information
  */
  

  async getProductData(barcode) {
    const url = this.productUrl + barcode;

    let nativeCall = this.nativeHttp.get(url, {}, {
      'Content-Type': 'application/json'
    });
    return nativeCall;
  }

  async getRecipeData(barcode,pageId, numberByPage) {
    const url = this.recipeUrl + barcode+'&page='+pageId+'&limit='+numberByPage;
    let nativeCall = this.nativeHttp.get(url, {}, {
      'Content-Type': 'application/json'
    });
    return nativeCall;
  }



}