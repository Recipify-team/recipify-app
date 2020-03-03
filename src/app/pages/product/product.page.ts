import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { from } from 'rxjs';
import { RecipeService } from 'src/app/api/recipe.service';

@Component({
	selector: 'app-product',
	templateUrl: './product.page.html',
	styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

	dataProduct: any;
	recipes: Array<Object>;
	recipesToDisplay: Array<Object>;
	index: number;

	pageId:number;
	numberByPage:number;

	constructor(private route: ActivatedRoute, private router: Router,
		private recipeService: RecipeService) {
		if (this.router.getCurrentNavigation().extras.state) {
			this.dataProduct = this.router.getCurrentNavigation().extras.state.product;
		}
		this.recipes = [];
		this.recipesToDisplay = [];
		this.pageId = 0;
		this.numberByPage = 8;
	}

	ngOnInit() {
		this.searchRecipe(this.dataProduct.id);
	}

	openRecipeWithState(recipe) {
		let navigationExtras: NavigationExtras = {
			state: {
				recipe: recipe
			}
		}
		this.router.navigate(['recipe'], navigationExtras);
	}

	searchRecipe(barcode,event?) {
		from(this.recipeService.getRecipeData(barcode, this.pageId, this.numberByPage)).pipe().subscribe(res => {
			if (JSON.parse(res.data) != null) {

				for (let i = 0; i < JSON.parse(res.data).length; ++i) {
					let recipe = JSON.parse(res.data)[i].data;

					// Check if image exist
					if (!recipe.hasOwnProperty('image')) {
						console.log('image not found');
						recipe['image'] = "assets/placeholder/placeholder-img.jpg";
					}

					// Ingredients refractor
					recipe.ingredients = recipe.ingredients.replace(/[".\{\}\[\]\/]/gi, '');
					recipe.ingredients = recipe.ingredients.split("', '").map(String);
					recipe.ingredients[0] = recipe.ingredients[0].replace("'", '')
					recipe.ingredients[recipe.ingredients.length - 1] = recipe.ingredients[recipe.ingredients.length - 1].replace("'", '')

					// Instructions refractor
					for (let i = 0; i < 10; ++i) {
						recipe.instructions = recipe.instructions.replace("Step " + i + " ", '')
					}
					recipe.instructions = recipe.instructions.split("\n").map(String);
					if(recipe.instructions[recipe.instructions.length-1]=' '){
						recipe.instructions.pop();
					}

					// Add product to list.
					this.recipes.push(recipe);
					this.recipesToDisplay.push(recipe);
					++this.index;

				};
				if (event.target) {
					event.target.complete();
				  }
			}else{
				if (event.target) {
					event.target.enable(false);
				  }
			}

		}, err => {
			console.log('JS Call error' + err);
		})
	}

	AddRecipe(event) {
		setTimeout(() => {
			this.pageId++;
			this.searchRecipe(this.dataProduct.id,event);
		  }, 400);	
	}
}