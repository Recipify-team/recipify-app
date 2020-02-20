import { Component } from '@angular/core';

import { RecipeService } from './../api/recipe.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController } from '@ionic/angular';

import { from } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';


import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import fr from 'javascript-time-ago/locale/fr'



@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})

export class HomePage {

	products: Array<Object>;
	productsToDisplay: Array<Object>;
	index: number;
	result: string;
	ishidden: boolean;

	constructor(private storage: Storage, private barcodeScanner: BarcodeScanner,
		private recipeService: RecipeService, private router: Router,
		private loadingCtrl: LoadingController, public toastController: ToastController) {
		this.products = [];
		this.productsToDisplay = [];
		this.index = 0;
		this.ishidden = true;
		this.loadDataFromStorage();
		this.init();
	}


	init() {
		document.addEventListener('backbutton', function (event) {
			if (this.ishidden == false) {
				this.ishidden = true;
				for (let i = 0; i < this.productsToDisplay.length; ++i) {
					this.productsToDisplay[i].isChecked = false;
				};
				event.preventDefault();
				event.stopPropagation();
			}
		}.bind(this), false);
	}

	onPressitem(product) {
		console.log("onPressitem");
		if (product.isChecked == false) {
			product.isChecked = true;
		} else {
			product.isChecked = false;
		}
		this.ishidden = false;
	}


	openDetailsWithState(product) {
		console.log("can't open: " + product.isChecked);
		if (this.ishidden != false) {
			let navigationExtras: NavigationExtras = {
				state: {
					product: product
				}
			}
			this.router.navigate(['product'], navigationExtras);
		}
	}

	RedirectToFavoritePage() {
		if (this.ishidden != false) {
			let navigationExtras: NavigationExtras = {
				state: {
					// product: product
				}
			}
			this.router.navigate(['favorite'], navigationExtras);
		}
	}



	// Function to set the headers
	myHeaderFn(index, product, products) {
		var first_current = new Date(product.creationdate);

		TimeAgo.addLocale(fr)
		const timeAgo = new TimeAgo('fr-FR')

		if (index == 0) {
			if (first_current.getDate() === new Date().getDate()) {
				return "aujourd'hui";
			}
			if (new Date().getMonth() == first_current.getMonth()) {
				return timeAgo.format(first_current.getTime() - 24 * 60 * 60 * 1000);
			} else {
				return timeAgo.format(first_current.getTime() - 365 * 24 * 60 * 60 * 1000, 'twitter');
			}
		}

		var first_prev = new Date(products[index - 1].creationdate);
		if (new Date().getMonth() != first_current.getMonth()) {
			return timeAgo.format(first_current.getTime() - 365 * 24 * 60 * 60 * 1000, 'twitter');
		}

		if (!(first_prev.getDate() === first_current.getDate() && first_prev.getMonth() === first_current.getMonth() && first_prev.getFullYear() === first_current.getFullYear())) {
			return timeAgo.format(first_current.getTime() - 24 * 60 * 60 * 1000);
		}
		return null;
	}
	// Load data for infiniteScroll
	DisplayMoreProducts(event) {
		setTimeout(() => {
			console.log('Done');
			event.target.complete();
			// Will add 5 elements to the displyed list
			for (let i = 0; i < 5; ++i) {
				++this.index;
				if (this.products[this.index] == null) {
					--this.index;
					break;
				}
				this.productsToDisplay.push(this.products[this.index]);
			}
			// App logic to determine if all data is loaded
			// and disable the infinite scroll
			if (this.productsToDisplay.length == 100) {
				event.target.disabled = true;
			}
		}, 800);
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
		});
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
						product['isChecked'] = false;
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
						this.products.unshift(product);
						this.productsToDisplay.unshift(product);
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

	scantest() {
		let testproduct = { name: "test", isChecked: false, id: 5161, creationdate: new Date() };
		if (!testproduct.hasOwnProperty('image')) {
			console.log('image not found');
			testproduct['image'] = "assets/placeholder/placeholder-img.jpg";
		}
		if (testproduct.name.length == 0) {
			this.presentToast();
		} else {
			this.products.unshift(testproduct);
			this.productsToDisplay.unshift(testproduct);

			++this.index;
		}
	}

	deepIndexOf(arr, obj) {
		return arr.find(i => i.creationdate === obj.creationdate);
	}

	removeItem(productsDisplayed) {
		for (let i = 0; i < productsDisplayed.length; ++i) {
			console.log("product is checked: " + productsDisplayed[i].isChecked);
			if (productsDisplayed[i].isChecked == true) {
				const index = this.products.indexOf(this.deepIndexOf(this.products, this.productsToDisplay[i]));
				if (index > -1) {
					this.products.splice(index, 1);

				}
				this.productsToDisplay.splice(i, 1);
			}

		}
		this.storage.set('products', this.products);
		this.ishidden = true;
	}
	clear() {
		this.products = [];
		this.productsToDisplay = [];
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