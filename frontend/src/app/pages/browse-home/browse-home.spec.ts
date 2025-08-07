import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseHome } from './browse-home';

describe('BrowseHome', () => {
  let component: BrowseHome;
  let fixture: ComponentFixture<BrowseHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
