import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { CommonService } from '../../../services/common-service/common.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    applyMargin = false;
    emailForm: FormGroup;
    public year;

    constructor(public services: CommonService, public fb: FormBuilder, public router: Router) {
        this.emailForm = this.fb.group({
            'email': [null, Validators.compose([Validators.required, Validators.pattern(this.services.info['validations']['email'])])]
        });
        const d = new Date();
        this.year = d.getFullYear();
    }

    ngOnInit() {
        this.router.events.subscribe((param) => {
            if (param instanceof NavigationEnd) {
                switch (param.url) {
                    case "/login":
                    case "/forgot-password":
                    case "/magiclink":
                        this.applyMargin = true;
                        console.log("Disabled margin.....................");
                        break;
                    default:
                        this.applyMargin = false;
                }

            }
        });
    }

    subscribeEmail(value) {
        if (this.emailForm.valid) {
            this.services.presentLoading();
            const request = {
                action_url: '/newsletter',
                method: 'POST',
                params: {
                    email: value['email']
                }
            };
            this
                .services.doHttp(request).subscribe(
                    data => {
                        this.services.dismissLoading();
                        this.emailForm.reset();
                        this.services.notification('Thanks for subscribing', true);
                    }, error => {
                        this.services.dismissLoading();
                        this.emailForm.reset();
                        this.services.notification('Thanks for subscribing', true);
                    });
        } else {
            this.services.markFormGroupTouched(this.emailForm);
        }
    }

    // support() {
    //     swal({
    //         text: 'Support',
    //         type: 'info',
    //         html: 'Contact us at <a href="mailto:support@surprisegift.store?Subject=">support@surpr' +
    //             'isegift.store</a>',
    //         cancelButtonText: 'Close'
    //     });
    // }

}
