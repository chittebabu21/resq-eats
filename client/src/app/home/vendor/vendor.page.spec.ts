import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorPage } from './vendor.page';

describe('VendorPage', () => {
  let component: VendorPage;
  let fixture: ComponentFixture<VendorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
