import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        return throwError(err.statusText);
                    }
                    const applicatiorError = err.headers.get('Application-Error');
                    if (applicatiorError) {
                        return throwError(applicatiorError);
                    }
                    const serverError = err.error;
                    let modelstateError = '';
                    if (serverError && typeof serverError === 'object') {
                        for (const key in serverError) {
                            if (serverError[key]) {
                                modelstateError += serverError[key] + '\n';
                            }
                        }
                    }
                    return throwError(modelstateError || serverError || 'Server Error');
                }
            })
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
