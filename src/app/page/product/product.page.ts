import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
	selector: 'app-product',
	templateUrl: './product.page.html',
	styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
	data : any;
	constructor(private route:ActivatedRoute,private router: Router) {
		if(this.router.getCurrentNavigation().extras.state){
				this.data = this.router.getCurrentNavigation().extras.state.product;
		}
	 }

	ngOnInit() {
	}

	openRecipeWithState(recipe) {
		let navigationExtras: NavigationExtras = {
			state: {
				recipe: recipe
			}
		}
		this.router.navigate(['recipe'], navigationExtras);
	}

}
