import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  // check for token
  const token = loginService.get('token');

  if (token) {
    return true;
  } else {
    alert('Login to continue...');
    localStorage.clear();
    router.navigateByUrl('/');
    return false;
  }
}
