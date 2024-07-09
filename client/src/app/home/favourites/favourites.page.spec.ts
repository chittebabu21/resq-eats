import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavouritesPage } from './favourites.page';

describe('FavouritesPage', () => {
  let component: FavouritesPage;
  let fixture: ComponentFixture<FavouritesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
