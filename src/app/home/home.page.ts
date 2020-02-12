import { Component } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController } from '@ionic/angular';

import { from } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';

import TimeAgo from 'javascript-time-ago'
 
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en'
import fr from 'javascript-time-ago/locale/fr'


@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage {

	products: Array<Object>;
	index: number;
	result: string;

	constructor(private storage: Storage, private barcodeScanner: BarcodeScanner,
		private recipeService: RecipeService, private router: Router,
		private loadingCtrl: LoadingController, public toastController: ToastController) {
		this.products = [];
		this.index = 0;
		this.loadDataFromStorage();
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
		const options: BarcodeScannerOptions = {
			preferFrontCamera: false, // iOS and Android
			showFlipCameraButton: false, // iOS and Android
			showTorchButton: false, // iOS and Android
			torchOn: false, // Android, launch with the torch switched on (if available)
			prompt: "Scan a product.", // Android
			resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
			formats: "all", // default: all but PDF_417 and RSS_EXPANDED
			orientation: "", // Android only (portrait|landscape), default unset so it rotates with the device
			disableAnimations: false, // iOS
			disableSuccessBeep: false // iOS and Android
		};
		this.barcodeScanner.scan(options).then(barcodeData => {
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
					if (JSON.parse(data.data) != null) {
						let product = JSON.parse(data.data).data;
						if (!product.hasOwnProperty('image')) {
							console.log('image not found');
							product['image'] = "assets/placeholder/placeholder-img.jpg";
						}
						if (product.name.length == 0) {
							console.log('name not found');
							product.name = "Sans nom";
						}
						product.creationdate = new Date();
						// Add product to list.
						this.products = [product, ...this.products];
						++this.index;
						// Save value in storage
						this.storage.set('products', this.products);
						this.loadingCtrl.getTop().then(hasLoading => {
							if (hasLoading) {
								this.loadingCtrl.dismiss();
							}
						});
						// Redirect
						this.openDetailsWithState(product);
					} else {
						this.loadingCtrl.getTop().then(hasLoading => {
							if (hasLoading) {
								this.loadingCtrl.dismiss();
							}
						});
						this.presentToast();
					}

				}, err => {
					console.log('JS Call error' + err);
				})
			}
		}).catch(err => {
			console.log('Scanner Error', err);
		});
	}

	myHeaderFn(record, recordIndex, records) {
		var first_current = new Date(record.creationdate);

		TimeAgo.addLocale(fr)
		const timeAgo = new TimeAgo('fr-FR')
		
		if (recordIndex == 0) {
			if (first_current.getDate() === new Date().getDate()) {
				return "aujourd'hui";
			}
			if(new Date().getMonth() == first_current.getMonth()){
				return timeAgo.format(first_current.getTime() - 24 * 60 * 60 * 1000);
			}else{
				return timeAgo.format(first_current.getTime() - 365 * 24 * 60 * 60 * 1000, 'twitter');
			}
		}

		var first_prev = new Date(records[recordIndex - 1].creationdate);
		if(new Date().getMonth() != first_current.getMonth()){
			return timeAgo.format(first_current.getTime() - 365 * 24 * 60 * 60 * 1000, 'twitter');
		}
		
		if (!(first_prev.getDate() === first_current.getDate() && first_prev.getMonth() === first_current.getMonth() && first_prev.getFullYear() === first_current.getFullYear())) {
			return timeAgo.format(first_current.getTime() - 24 * 60 * 60 * 1000);
		}
		
		return null;
	}

	loadDataFromStorage() {
		this.storage.get('products').then((val) => {
			this.products = val ? val : [];
		});
	}

	scantest() {
		let testproduct = { name: "test",  id: 5161, creationdate: new Date() };
		if (!testproduct.hasOwnProperty('image')) {
			console.log('image not found');
			testproduct['image'] = "assets/placeholder/placeholder-img.jpg";
		}
		if (testproduct.name.length == 0) {
			this.presentToast();
		} else {
			this.products = [testproduct, ...this.products];

			++this.index;
		}
	}

	clear() {
		this.products = [];
		this.storage.clear();
		console.log("db_clear");
	}
	async presentToast() {
		const toast = await this.toastController.create({
			message: 'Product not found.',
			position: 'top',
			color: 'danger',
			duration: 2000,
			buttons: [
				{
					side: 'start',
					icon: 'close',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		toast.present();
	}
}


