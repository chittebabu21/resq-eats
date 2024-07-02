import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodDetailPage } from './food-detail.page';

describe('FoodDetailPage', () => {
  let component: FoodDetailPage;
  let fixture: ComponentFixture<FoodDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
