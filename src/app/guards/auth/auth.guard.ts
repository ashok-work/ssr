import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(public auth: AuthService, public router: Router, public utils: UtilsService) {

    }

    canActivate(): boolean {
        if (!this.auth.isAuthenticated()) {
            this.utils.clearUserData();
            this.router.navigate(['/login'], { replaceUrl: true });
            return false;
        }
        return true;
    }
}
