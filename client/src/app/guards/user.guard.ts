import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  // check for token
  const token = userService.get('token');

  if (token) {
    return true;
  } else {
    localStorage.clear();
    router.navigateByUrl('/');
    return false;
  }
};
