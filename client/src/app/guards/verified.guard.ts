import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const verifiedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  // check for token
  const userId = userService.get('userId');

  if (userId) {
    userService.getUserById(parseInt(userId)).subscribe({
        next: (response: any) => {
            const user = response.data;

            if (user.is_verified === 1) {
                return true;
            } else {
                alert('Login to continue...');
                localStorage.clear();
                router.navigateByUrl('/');
                return false;
            }
        } 
    });
  } 

  return false;
};