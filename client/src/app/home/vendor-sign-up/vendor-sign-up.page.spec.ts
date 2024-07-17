import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VendorSignUpPage } from './vendor-sign-up.page';

describe('VendorSignUpPage', () => {
  let component: VendorSignUpPage;
  let fixture: ComponentFixture<VendorSignUpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorSignUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
