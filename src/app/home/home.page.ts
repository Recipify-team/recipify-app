import { Component, ViewChild } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';


import { Platform, ToastController, LoadingController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';

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

	constructor(private storage: Storage, private barcodeScanner: BarcodeScanner,
		private recipeService: RecipeService, private route: ActivatedRoute,
		private router: Router, private loadingCtrl: LoadingController) {
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

	openDetailsWithState(product) {
		let navigationExtras: NavigationExtras = {
			state: {
				product: product
			}
		}
		this.router.navigate(['product'], navigationExtras);
	}


	//==============Scan===================
	scan() {
		this.barcodeScanner.scan().then(barcodeData => {
			if (!barcodeData.cancelled) {
				this.loadingCtrl.getTop().then(hasLoading => {
					if (!hasLoading) {
						this.loadingCtrl.create({
							spinner: 'crescent',
							translucent: true,
							message: 'Searching recipe ...'
						}).then(loading => loading.present())
					}
				});

				from(this.recipeService.getDataNativeHttp(barcodeData.text)).pipe().subscribe(data => {
					let product = JSON.parse(data.data).data;
					this.products.unshift(product);
					this.productsToDisplay.unshift(product);
					++this.index;
					this.storage.set('products', this.products);
					
					// Redirect
					this.openDetailsWithState(product);

					this.loadingCtrl.getTop().then(hasLoading => {
						if (hasLoading) {
							this.loadingCtrl.dismiss();
						}
					});

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
		// from(this.recipeService.getDataNativeHttp('061314000070')).pipe(
		//   finalize(() => console.log("testInsidePipe"))
		// ).subscribe(data => {
		//   console.log('native data' + JSON.stringify(data.data));
		//   this.num = JSON.parse(data.data);
		//   this.products.unshift(JSON.parse(data.data));
		//   this.productsToDisplay.unshift(JSON.parse(data.data));
		//   ++this.index;
		// }, err => {
		//   console.log('JS Call error' + err);
		// })
		this.num = '565464';
		this.products.unshift(this.num);
		this.productsToDisplay.unshift(this.num);
		++this.index;
	}

	clear() {
		this.products = [];
		this.productsToDisplay = [];
		this.storage.clear();
		console.log("db_clear");
	}
}


