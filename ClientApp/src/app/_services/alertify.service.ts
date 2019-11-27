import { Injectable } from '@angular/core';
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

  constructor() { }
  confirm(message: string, okCallback: () => any) {
    // tslint:disable-next-line: only-arrow-functions
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else { }
    });
  }
  success(message: string) {
    alertify.set('notifier', 'position', 'top-left');
    alertify.set('notifier', 'delay', '2');
    alertify.success(message);
  }
  error(message: string) {
    alertify.error(message);
  }
  warning(message: string) {
    alertify.warning(message);
  }
  message(message: string) {
    alertify.set('notifier', 'position', 'bottom-left');
    alertify.message(message);
  }


}
