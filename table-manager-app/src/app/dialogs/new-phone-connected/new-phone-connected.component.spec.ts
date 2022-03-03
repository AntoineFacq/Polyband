import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPhoneConnectedComponent } from './new-phone-connected.component';

describe('NewPhoneConnectedComponent', () => {
  let component: NewPhoneConnectedComponent;
  let fixture: ComponentFixture<NewPhoneConnectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPhoneConnectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPhoneConnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
