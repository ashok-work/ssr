import { Injectable, EventEmitter } from '@angular/core';
import { CookieDataService } from '../cookie-service/cookie.service';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common-service/common.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material';
import { IUserProfile } from 'src/app/interfaces/spaces';
import { Socket } from 'ngx-socket-io';

@Injectable()
export class UtilsService {

    public user: IUserProfile = undefined;
    public user_token: any = false;
    public config = {};
    public updateSpecificEvents = new EventEmitter<string>();

    constructor(public cookieService: CookieDataService,
        public router: Router,
        public services: CommonService,
        public socket: Socket) {
        this.cookieService.put('country', 'in');
    }

    public joinUserOnLoggedIn() {
        this.socket.emit('login', {
            user_id: this.user['user_id']
        });
    }
​
    public socketLogout(user_id) {
        this.socket.emit('logout', {
            user_id: user_id
        });
    }

    public join(space_id: string, host: string, host_name: string) {
        const conversation_id = `${space_id}_${host}_${this.user['user_id']}`;
        let request = {
            action_url: '/chat/conversation',
            method: 'POST',
            params: {
                conversation_id: conversation_id,
                customer: this.user['user_id'],
                host: host,
                host_name: host_name,
                name: this.user['user_name']
            }
        };
        this.services.doHttp(request).subscribe(
            (data: any) => {
                this.router.navigate(['/chat'], {
                    queryParams: {
                        conversation_id: conversation_id,
                        chat_id: data['data']['id']
                    }
                });
            },
            error => {
                console.log(error);
                this.services.errorHandler(error);
            }
        );
    }

    public check_user_key(key: string) {
        if (this.user.hasOwnProperty(key)) {
            return true;
        } else {
            return false;
        }
    }

    public currencyFormat(price) {
        return this.config['currency'] + price;
    }

    public checkUserLogin() {
        const token = this.cookieService.get(environment['token']);
        // const user = this.cookieService.getObject(environment['user']);
        if (!token) {
            this.clearUserData();
        } else {
            this.router.navigate([''], { replaceUrl: true });
        }
    }

    public checkUserDetails() {
        const token = this.cookieService.get(environment['token']);
        // const user = this.cookieService.getObject(environment['user']);
        if (token) {
            return true;
        } else {
            return false;
        }
    }

    public isUserLoggedIn() {
        const token = this.cookieService.get(environment['token']);
        // const user = this.cookieService.getObject(environment['user']);
        if (!token) {
            this.clearUserData();
            this.gotoHome();
            return false;
        }
        return true;
    }

    public logout() {
        this.socketLogout(this.user['user_id']);
        this.clearUserData();
        this.gotoHome();
    }

    public clearUserData() {
        this.cookieService.remove(environment['token']);
        // this.cookieService.remove(environment['user']);
        this.user = null;
        this.user_token = false;
    }

    async initApp(navigate?: boolean) {
        try {
            const token = this.cookieService.get(environment['token']);
            if (token) {
                this.getUser();
                this.getUserToken();
                const user = await this.getUserDetails(navigate);
                return true;
            }
        } catch (err) {
            console.error(err);
        }
    }

    public getUserDetails(navigate = false, reload = false) {
        return new Promise((resolve, reject) => {

            if (this.user && !reload) {
                resolve(this.user);
                return;
            }

            let request = {
                action_url: '/user/up',
                method: 'GET',
                params: {}
            };
            this.services.doHttp(request).subscribe(
                (data: any) => {
                    this.user = data;
                    // this.socket.emit('');
                    // this.updateSpecificEvents.emit('avatar');
                    this.joinUserOnLoggedIn();
                    if (navigate) {
                        this.router.navigate(['/']);
                    }
                    resolve(data);
                },
                error => {
                    console.log(error);
                    this.services.errorHandler(error);
                    reject(error);
                });
        });
    }

    public getUser(): IUserProfile {
        // this.user = <any>this.cookieService.getObject(environment['user']);
        return this.user;
    }

    public getUserToken() {
        const user_token = this.getCookie(environment['token']);
        return user_token;
        /*
        if (user_token) {
            const token = JSON.parse(user_token);
            console.log('token', token);
            this.user_token = token['user_token'];
            return this.user_token;
        } else {
            return false;
        }
        */
    }

    public scrollTop() {
        window.scroll(0, 0);
    }

    public validateEmail(email: string) {
        return this.config['validations']['email'].test(email);
    }

    public validateMobile(mobile: string) {
        return this.config['validations']['mobile'].test(mobile);
    }

    public gotoHome() {
        this.router.navigate(['/login']).then(resp => console.log(resp));
    }

    /**
     * set cookie
     * @param cName
     * @param cValue
     */
    public setCookie(cName: string, cValue: string) {
        return this.cookieService.put(cName, cValue);
    }

    /**
     * get cookie angular 2
     * @param cName
     * @returns {string}
     */
    public getCookie(cName: string) {
        return this.cookieService.get(cName);
    }

    public checkCookie(cName: string) {
        return this.cookieService.get(cName);
    }

    /**
     * delete cookie
     * @param cName
     */
    public deleteCookie(cName: string) {
        return this.cookieService.remove(cName);
    }
}
