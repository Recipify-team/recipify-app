import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from 'src/app/services/header.service';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'app-favorite',
	templateUrl: './favorite.page.html',
	styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

	favRecipes: any;
	displayedFavRecipe: any;
	tmp: any;
	index: number;
	result: string;
	ishidden: boolean;
	constructor(private router: Router, public headerService: HeaderService, private storage: Storage) {
		this.favRecipes = [];
		this.displayedFavRecipe = [];
		this.index = 0;
		this.ishidden = true;
	}


	ngOnInit() {

	}

	ionViewWillEnter() {
		this.loadDataFromStorage();
	}

	loadDataFromStorage() {
		this.storage.get('favorites').then((val) => {
			this.favRecipes = val ? val : [];
			this.displayedFavRecipe = this.favRecipes.slice(0, 4);
		});
	}

	getRecipeHeader(index, recipe, recipes) {
		return this.headerService.setHeaderByDate(index, recipe, recipes);
	}

	openRecipeWithState(recipe) {
		let navigationExtras: NavigationExtras = {
			state: {
				recipe: recipe
			}
		}
		this.router.navigate(['recipe'], navigationExtras);
	}

	onPressitem(recipe) {
		console.log("onPressitem");
		if (recipe.isChecked == false) {
			recipe.isChecked = true;
		} else {
			recipe.isChecked = false;
		}
		this.ishidden = false;
	}
}