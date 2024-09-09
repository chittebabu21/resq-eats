import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountPage } from './account.page';
import { UserService } from '../../services/user.service';
import { NavController, ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { User } from '../../interfaces/user';

describe('AccountPage', () => {
  let component: AccountPage;
  let fixture: ComponentFixture<AccountPage>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    // Mock UserService
    const mockUserService = jasmine.createSpyObj('UserService', ['getUserById', 'logout']);

    // Mock NavController
    const mockNavController = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack']);

    // Mock ModalController
    const mockModalController = jasmine.createSpyObj('ModalController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [AccountPage],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: NavController, useValue: mockNavController },
        { provide: ModalController, useValue: mockModalController }
      ]
    }).compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    modalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;

    fixture = TestBed.createComponent(AccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user by ID on initialization', () => {
    const mockUser: User = {
      user_id: 1,
      username: 'Tony',
      is_verified: 1,
      email_address: 'test@gmail.com',
      image_url: 'http://localhost:4000/uploads/image.png',
      created_on: new Date(),
      password_hash: ''
    };

    spyOn(localStorage, 'getItem').and.returnValue('1');
    userServiceSpy.getUserById.and.returnValue(of(mockUser));

    component.ngOnInit();
    fixture.detectChanges();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.user).toEqual(mockUser);
    expect(component.isUser).toBe(true);
    expect(component.isVerified).toBe(true);
  });

  it('should handle getUserById error gracefully', () => {
    spyOn(localStorage, 'getItem').and.returnValue('1');
    userServiceSpy.getUserById.and.returnValue(throwError(() => new Error('Error fetching user')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(userServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.isUser).toBe(false);
  });

  it('should log out the user and navigate back to the root page', () => {
    component.logout();

    expect(userServiceSpy.logout).toHaveBeenCalled();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith('/');
  });

  it('should navigate to vendor page on switch', () => {
    component.onSwitchVendor();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/home/vendor');
  });
});
