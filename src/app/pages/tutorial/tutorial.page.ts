import { Component, OnInit } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor(private router: Router,private storage: Storage) { }

  ngOnInit() {
    
  }
  finishTuto(){
    this.RedirectToMenu();
  }

  RedirectToMenu() {
    this.storage.set('tutorialDone', true);
			let navigationExtras: NavigationExtras = {
				state: {
			
				}
			}
			this.router.navigate(['home'], navigationExtras);
	}
}
