import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
  data : any;
  constructor(private route:ActivatedRoute,private router: Router) {
		if(this.router.getCurrentNavigation().extras.state){
				this.data = this.router.getCurrentNavigation().extras.state.recipe;
		}
	 }

  ngOnInit() {
  }

}
