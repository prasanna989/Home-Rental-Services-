import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyPreview } from './property-preview';

describe('PropertyPreview', () => {
  let component: PropertyPreview;
  let fixture: ComponentFixture<PropertyPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
