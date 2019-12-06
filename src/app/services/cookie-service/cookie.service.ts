import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../../environments/environment';

@Injectable()
export class CookieDataService {


    constructor(public cookieService: CookieService) {

    }

    getCookieOptions() {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return {
            expires: date,
            path: environment.cookiePath,
            domain: environment.cookieDomain,
            secure: environment.cookieSecure
        }
    }

    getObject(key: string) {
        const data = this.cookieService.get(key);
        if (data) {
            try {
                return JSON.parse(data);
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }

    putObject(key: string, value) {
        // this.cookieService.set(key, JSON.stringify(value), this.expires, this.path);
        this.cookieService.put(key, JSON.stringify(value), this.getCookieOptions());
    }

    put(key: string, value) {
        console.log(key, value);
        // this.cookieService.set(key, value, expires?: number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'Strict' );
        this.cookieService.put(key, value, this.getCookieOptions());
    }

    get(key: string) {
        return this.cookieService.get(key);
    }

    remove(key: string) {
        // document.cookie = `${key}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
        this.cookieService.remove(key, this.getCookieOptions());
    }

    deleteAll() {
        this.cookieService.removeAll();
    }
}
