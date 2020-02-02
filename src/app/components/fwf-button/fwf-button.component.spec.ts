import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FwfButtonComponent } from './fwf-button.component';

describe('FwfButtonComponent', () => {
  let component: FwfButtonComponent;
  let fixture: ComponentFixture<FwfButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FwfButtonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FwfButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
