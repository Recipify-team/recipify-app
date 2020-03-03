import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
@Component({
	selector: 'app-recipe',
	templateUrl: './recipe.page.html',
	styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
	data: any;
	favorites: any;
	isFavorite: boolean;
	constructor(private router: Router, private storage: Storage, private toastController: ToastController) {
		if (this.router.getCurrentNavigation().extras.state) {
			this.data = this.router.getCurrentNavigation().extras.state.recipe;
		}
		this.favorites = [];
		this.TestIfFavorite();
	}

	ngOnInit() {	
	}
	
	TestIfFavorite() {
		this.storage.get('favorites').then((val) => {
			this.favorites = val ? val : [];
			for (let i = 0; i < this.favorites.length; ++i) {
				if (this.data.id == this.favorites[i].id) {
					this.isFavorite = true;
					break;
				}else{
					this.isFavorite = false;
				}
			}
		});
	}

	deepIndexOf(arr, obj) {
		return arr.find(i => i.id === obj.id);
	}

	addOrRemoveToFavorite() {
		if(this.isFavorite == true){

			this.isFavorite = false;
			this.presentToast("Recipe remove to favorite.");
			const index = this.favorites.indexOf(this.deepIndexOf(this.favorites, this.data));
			if (index > -1) {
				this.favorites.splice(index, 1);
			}
			this.storage.set('favorites', this.favorites);
			
			
		}else{
			this.isFavorite = true;
			this.presentToast("Recipe added to favorite.");
			this.favorites.unshift(this.data);
			this.storage.set('favorites', this.favorites);
		}
	}

	async presentToast(msg) {
		const toast = await this.toastController.create({
			message: msg,
			position: 'top',
			color: 'warning',
			duration: 1000,
		});
		toast.present();
	}
}
