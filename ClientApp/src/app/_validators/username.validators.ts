import { AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

export class UsernameValidators {
        // static debouncer: any;
        static userService: UserService;
    constructor(private authservice: AuthService) { }
    static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
        if ((control.value as string).indexOf(' ') >= 0) {
            return { cannotContainSpace: true };
        }
        return null;
    }
    // static shouldBeUnique(control: AbstractControl): ValidationErrors | null {
    //             if (control.value === 'limon') {
    //                 return { shouldBeUnique: true };
    //             } else {
    //                 return (null);
    //             }
    // }
    static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'limon') {
                    resolve({ shouldBeUnique: true });
                } else {
                    resolve(null);
                }
            }, 5000);
        });
    }

//   static  checkUsername(control: AbstractControl): any {

//         clearTimeout(this.debouncer);

//         return new Promise(resolve => {

//             this.debouncer = setTimeout(() => {

//                 this.userService.checkUsernameAvailAvility(control.value).subscribe((res) => {
//                     if (res) {
//                         resolve(null);
//                     }
//                 }, (err) => {
//                     resolve({ 'usernameInUse': true });
//                 });
//             }, 1000);
//         });
//     }
}
