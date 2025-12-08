import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedInUser: any = localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser') || "");
  const router = inject(Router);
  const authService = inject(AuthService);

  if (loggedInUser && loggedInUser.userId && !loggedInUser.access_token) {
    authService.resetStorage();
  }

  if (loggedInUser && loggedInUser.access_token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `${loggedInUser.token_type} ${loggedInUser.access_token}`
      }
    });

    // return next(cloned);
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error("Authorization denied. Please login again.", error);
          router.navigateByUrl('/home');
          authService.resetStorage();
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};

