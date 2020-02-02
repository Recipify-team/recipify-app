import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';

import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  url = 'http://165.227.49.166:3000/product/';
  public result : Observable<any> = new Observable<any>();
  constructor(private http: HTTP) { }

  /**
  * Get the detailed information for an ID using the "i" parameter
  * 
  * @param {string} barcode imdbID to retrieve information
  * @returns Observable with detailed information
  */
  async getData(barcode) {
    try {
      const url = this.url + barcode;
      const params = {};
      const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT', 'Accept': 'application/json', 'content-type': 'application/json' };

      const result = await this.http.get(url, params, headers);

      console.log(result.status);
      console.log("RECIPE RESULST" + JSON.stringify(result.data)); // JSON data returned by server
      console.log(result.headers);


    } catch (error) {
      console.error(error.status);
      console.error(error.error); // Error message as string
      console.error(error.headers);
    }

  }

}