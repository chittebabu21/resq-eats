import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPasswordLinkComponent } from './send-password-link.component';

describe('SendPasswordLinkComponent', () => {
  let component: SendPasswordLinkComponent;
  let fixture: ComponentFixture<SendPasswordLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SendPasswordLinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPasswordLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
