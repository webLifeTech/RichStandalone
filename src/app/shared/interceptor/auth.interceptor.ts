import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const loggedInUser: any = localStorage.getItem('loggedInUser') && JSON.parse(localStorage.getItem('loggedInUser') || "");

  if (loggedInUser && loggedInUser.access_token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `${loggedInUser.token_type} ${loggedInUser.access_token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};
