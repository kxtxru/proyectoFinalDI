import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdivinaComponent } from './adivina.component';

describe('AdivinaComponent', () => {
  let component: AdivinaComponent;
  let fixture: ComponentFixture<AdivinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdivinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdivinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
