import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(public auth: AuthService,
        public router: Router) {

    }

    canActivate(): boolean {
        if (this.auth.isAuthenticated()) {
            this.router.navigate([''], { replaceUrl: true });
            return false;
        }
        return true;
    }
}
