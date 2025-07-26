import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeList } from './home-list';

describe('HomeList', () => {
  let component: HomeList;
  let fixture: ComponentFixture<HomeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
