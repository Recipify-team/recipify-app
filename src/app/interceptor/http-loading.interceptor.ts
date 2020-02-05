import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { LoadingController, ToastController } from '@ionic/angular';
import { catchError, finalize } from 'rxjs/operators';


@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
    constructor(private loadingCtrl: LoadingController,
        private toastController: ToastController) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        
        this.loadingCtrl.getTop().then(hasLoading => {
            if (!hasLoading) {
                this.loadingCtrl.create({
                    spinner: 'crescent',
                    translucent: true
                }).then(loading => loading.present())
            }
        });
        return next.handle(request).pipe(
            catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    switch ((<HttpErrorResponse>err).status) {
                        case 401:

                        default:
                            return throwError(err);
                    }
                } else {
                    return throwError(err);
                }
            }),
            catchError(err => {
                console.log('error: ', err);
                this.presentToast('error: '+ err);
                return EMPTY;
            }),
            finalize(() => {
                this.loadingCtrl.getTop().then(hasLoading => {
                    if (hasLoading) {
                        this.loadingCtrl.dismiss();
                        this.presentToast('load succeful');
                    }
                });
            })
        );
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 1500
        });
        toast.present();
    }

}
