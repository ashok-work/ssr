import {Injectable} from '@angular/core';
import {CookieDataService} from '../cookie-service/cookie.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {

    constructor(public cookieService: CookieDataService) {
    }

    public isAuthenticated(): boolean {
        const token: any = this.cookieService.get(environment['token']);
        // const user: any = this.cookieService.getObject(environment['user']);
        return (token);
    }

    public isUserLoggedIn(): boolean {
        const token: any = this.cookieService.get(environment['token']);
        // const user: any = this.cookieService.getObject(environment['user']);
        return (token);
    }

}
