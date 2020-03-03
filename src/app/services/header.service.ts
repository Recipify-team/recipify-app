import { Injectable } from '@angular/core';

import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }
  // Function to set the headers
  setHeaderByDate(index, product, products) {

	  console.log("index :" + index);
	  console.log("current creation date :" + product.creationdate);
	  console.log("current creation Format date :" + moment(product.creationdate).fromNow());
	  console.log("current creation Format date :" + moment(product.creationdate).calendar());
		var first_current = new Date(product.creationdate);

		if (index == 0) {
			if (first_current.getDate() === new Date().getDate()) {
				return "Today";
			}
			if (new Date().getMonth() == first_current.getMonth()) {
				return moment(product.creationdate).fromNow();
			} else {
				return moment(product.creationdate).calendar();
			}
		}

		var first_prev = new Date(products[index-1].creationdate);
		console.log("test: "+first_current.getDay());
		if(new Date().getMonth() == first_current.getMonth()){
			if (first_current.getDay()!=first_prev.getDay()) {
				return moment(product.creationdate).fromNow();
			}
		}else{
			if (first_current.getDay()!=first_prev.getDay()) {
				return moment(product.creationdate).calendar();
			}
		}
		

		// if (!(first_prev.getDate() === first_current.getDate() && first_prev.getMonth() === first_current.getMonth() && first_prev.getFullYear() === first_current.getFullYear())) {
		// 	return moment(product.creationdate).calendar();
		// }
		return null;
	}
}
