import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookHome } from './book-home';

describe('BookHome', () => {
  let component: BookHome;
  let fixture: ComponentFixture<BookHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
