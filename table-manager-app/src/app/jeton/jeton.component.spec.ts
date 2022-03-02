import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JetonComponent } from './jeton.component';

describe('JetonComponent', () => {
  let component: JetonComponent;
  let fixture: ComponentFixture<JetonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JetonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JetonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
