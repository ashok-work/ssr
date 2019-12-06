import { Component, OnInit, HostListener, ViewChild, QueryList, ElementRef, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonService } from '../../services/common-service/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Maps } from '../../services/maps/maps';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
// import { AddSpaceService } from '../create-space/add-space.service';
import { UtilsService } from '../../services/utils/utils.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { DomSanitizer } from '@angular/platform-browser';
import { AwsS3Service } from '../../services/aws-s3/aws-s3.service';
import { AlertController } from '@ionic/angular';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export interface IBooked {
    event_start_date: string;
    event_end_date: string;
}

export interface IOperatingDay {
    isOpen: boolean;
    allDay: boolean;
    hours: Array<FormGroup>;
}

@Component({
    selector: 'new-space',
    templateUrl: './new-space.component.html',
    styleUrls: ['./new-space.component.scss']
})
export class NewSpaceComponent implements OnInit, AfterViewInit {

    space_id: any;
    spaceForm: FormGroup;
    event_types: any = [];
    space_data: any = {};
    space: any = false;
    progress = 0;
    section: number = 1;
    secondSectionTouched = false;
    thirdSectionTouched = false;
    images: Array<any> = [];
    imagesData: Array<any> = [];
    showTimings = false;
    selectedDate: any;
    blockedTimes: { [date: string]: Array<IBooked>; } = {};
    operatingDays: { [day: string]: boolean } = {};
    showTimes: { [day: string]: boolean } = {};
    operating_hours: any = [];
    agreed = false;
    confirmed = false;
    operatingHoursFlag = true;
    lat = 17.4082338;
    lng = 78.4467743;
    showTaxMessage = false;
    renderUI = true;
    isBrowser: any;

    //Temporary variables
    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    spaceStyles = ['Classic', 'Industrial', 'Intimate', 'Luxurious', 'Minimalist', 'Modern', 'Raw', 'Whimsical']
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    timings: Array<any> = [];

    constructor(public services: CommonService,
        public route: ActivatedRoute,
        public router: Router,
        public maps: Maps,
        public fb: FormBuilder,
        // public addSpaceService: AddSpaceService,
        public utils: UtilsService,
        public _DomSanitizationService: DomSanitizer,
        public awsServices: AwsS3Service,
        public alertController: AlertController,
        @Inject(PLATFORM_ID) public platformId: Object) {
            this.isBrowser = isPlatformBrowser(this.platformId);
        this.createSpaceForm();
        this.route.params.subscribe(params => {
            this.space_id = params['space_id'];
            if (this.space_id) this.renderUI = false;
        });
        this.getEventTypes();
        this.getSpaceMiscData();
        for (let i = 0; i < 24; i++) {
            this.timings.push(this.createTimeObject(i));
            // this.timings.push(this.createTimeObject2(i));
        }
        this.timings.push({
            'hours': 23,
            'minutes': 59,
            'text': "11:59 PM",
            'disabled': false
        });
        if (!this.space_id) {
            for (let x in this.days) {
                let hours = [];
                hours.push({
                    start_time: {
                        'hours': 0,
                        'minutes': 0,
                        'text': "12:00 AM",
                        'disabled': false
                    },
                    end_time: {
                        'hours': 23,
                        'minutes': 59,
                        'text': "11:59 PM",
                        'disabled': false
                    },
                });
                this.operating_hours.push({
                    'isOpen': false,
                    'allDay': true,
                    'hours': hours
                })
            }
            this.services.setTitle('Create Space');
        } else {
            this.services.setTitle('Edit Space');
        }
    }

    createOperatingHoursForm() {
        return this.fb.group({
            start_time: '',
            end_time: ''
        });
    }

    addOperatingHoursForm(index) {
        this.operating_hours[index]['hours'].push({
            start_time: '',
            end_time: '',
        });
    }

    removeOperatingHoursForm(index) {
        if (this.operating_hours[index]['hours'].length > 1) this.operating_hours[index]['hours'].splice(-1, 1);
    }

    compareTimeObj(t1: any, t2: any) {
        if (t1 && t2) {
            return t1.hours == t2.hours && t1.minutes == t2.minutes
        }
        return false;
    }

    createTimeObject(hours) {
        let text = "";

        if (hours == 0) {
            text = "12:00 AM";
        } else if (hours < 12) {
            text = hours + ":00 AM";
        } else if (hours > 12) {
            text = (hours - 12) + ":00 PM";
        } else {
            text = hours + ":00 PM";
        }

        return {
            'hours': hours,
            'minutes': 0,
            'text': text
        }
    }

    createTimeObject2(hours) {
        let text = "";

        if (hours == 0) {
            text = "12:30 AM";
        } else if (hours < 12) {
            text = hours + ":30 AM";
        } else if (hours > 12) {
            text = (hours - 12) + ":30 PM";
        } else {
            text = hours + ":30 PM";
        }

        return {
            'hours': hours,
            'minutes': 30,
            'text': text
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?) {
        if (window.innerWidth > 1015) document.getElementById('custom-row').style.height = window.innerHeight - 57 + 'px';
        else document.getElementById('custom-row').style.height = window.innerHeight - 57 + 'px';
    }

    ngOnInit() {
        console.log(this);
        this.spaceForm.valueChanges.subscribe(val => {
            // this.addSpaceService.currentData = this.spaceForm.value;
            this.updateProgress()
        });
    }

    ngAfterViewInit() {
        this.onResize();
    }

    createSpaceForm() {
        this.spaceForm = this.fb.group({
            'name': [null],
            'space_type': [[]],
            'price': [null],
            'price_info': [null],
            'discount': [null],
            'min_hours': [null],
            'formatted_address': [null],
            'address2': [null],
            address: this.fb.group({
                city: [null],
                formatted_address: [null],
                lat: [null],
                lng: [null],
                name: [null],
                place_id: [null],
                postalcode: [null],
                state: [null],
                street_address: [null],
                country: [null],
                area: [null]
            }),
            'hours': [null],
            'restrictions': [null],
            'apartment': [null],
            'cancellation_policy': [null],
            'description': [null],
            'amenities': [[]],
            'accessibility': [[]],
            'services': [[]],
            'images': [[]],
            'space_rules': [[]],
            'status': ['incomplete'],
            'capacity': [null],
            'rooms': [null],
            'rest_rooms': [null],
            'floor_no': [null],
            'area': [null],
            'space_kind': [null],
            'notice_period': [null],
            'operating_hours': [[]],
            'holding_period': [null],
            'security_deposit': [null],
            'is_taxable': [false],
            'tax': [18],
            'catering_available': [true],
            'catering_mandatory': [false],
            'min_catering_amount': [null],
            'included_hours': [null],
            'is_allow_full_space_for_rent': [true],
        });
    }

    getEventTypes() {
        const request = {
            params: {},
            method: 'GET',
            action_url: '/invite/event_type'
        };
        this.services.presentLoading();
        this.services.doHttp(request).subscribe(
            data => {
                console.log(data);
                // this.services.dismissLoading();
                this.event_types = data;
            },
            error => {
                console.log(error);
                this.services.dismissLoading();
                this.services.errorHandler(error);
            });
    }

    getSpaceMiscData() {
        const request = {
            params: {},
            method: 'GET',
            action_url: '/spaces/misc/info'
        };
        this.services.doHttp(request).subscribe(data => {
            console.log(data);
            this.services.dismissLoading();
            this.space_data = data;
            if (this.space_id) {
                this.getSpaceDetails();
            }
        }, error => {
            console.log(error);
            this.services.dismissLoading();
            this.services.errorHandler(error);
        });
    }

    setSpaceForm() {
        this.spaceForm.patchValue({
            name: this.space.name,
            space_type: this.space.space_type,
            price: this.space.price,
            price_info: this.space.price_info,
            discount: this.space.discount,
            min_hours: this.space.min_hours,
            formatted_address: this.space.address['formatted_address'],
            address2: this.space.address['address2'],
            address: this.space.address,
            hours: this.space.hours,
            restrictions: this.space.restrictions,
            apartment: this.space.apartment,
            cancellation_policy: this.space.cancellation_policy,
            description: this.space.description,
            amenities: this.space.amenities,
            accessibility: this.space.accessibility,
            services: this.space.services,
            images: this.space.images,
            space_rules: this.space.space_rules,
            capacity: this.space.capacity,
            status: this.space.status,
            rooms: this.space.rooms,
            rest_rooms: this.space.rest_rooms,
            floor_no: this.space.floor_no,
            area: this.space.area,
            space_kind: this.space.space_kind,
            notice_period: this.space.notice_period,
            operating_hours: this.space.operating_hours,
            holding_period: this.space.holding_period,
            security_deposit: this.space.security_deposit,
            is_taxable: this.space.is_taxable,
            tax: this.space.tax,
            catering_available: this.space.catering_available,
            catering_mandatory: this.space.catering_mandatory,
            min_catering_amount: this.space.min_catering_amount,
            included_hours: this.space.included_hours,
            is_allow_full_space_for_rent: this.space.is_allow_full_space_for_rent,
        });

        if (this.spaceForm.value.tax != null) this.showTaxMessage = true;

        this.checkPolicy();

        this.operating_hours = this.spaceForm.value.operating_hours;

        // for (let i = 0; i < this.spaceForm.value.operating_hours.length; i++) {
        //     for (let j = 0; j < this.spaceForm.value.operating_hours[i]['hours'].length; j++) {
        //         let hour = this.spaceForm.value.operating_hours[i]['hours'][j];
        //         this.operating_hours[i]['hours'][j] = this.createOperatingHoursForm();
        //         if (hour != null && hour['start_time']) this.operating_hours[i]['hours'][j].get('start_time').setValue(hour['start_time']);
        //         if (hour != null && hour['end_time']) this.operating_hours[i]['hours'][j].get('end_time').setValue(hour['end_time']);
        //     }
        // }

        let formObj = this.spaceForm.value;
        if (formObj.capacity && formObj.area && formObj.formatted_address) this.section = 4;
        // if (formObj.name && formObj.description) this.section = 11;
        this.renderUI = true;
    }

    getSpaceDetails() {
        const request = {
            params: {},
            method: 'GET',
            action_url: '/spaces/' + this.space_id
        };
        this.services.doHttp(request).subscribe(data => {
            console.log(data);
            this.services.dismissLoading();
            this.space = data;
            this.setSpaceForm();
        }, error => {
            console.log(error);
            this.services.dismissLoading();
            this.services.errorHandler(error);
        });
    }

    public updateProgress() {
        let count = 0;

        Object.values(this.spaceForm.value).every((x: any) => {
            if (x) {
                if (x.constructor === Array) {
                    if (x.length > 0) count++;
                }
                else {
                    count++;
                }
            }
            return true;
        });
        this.progress = (count / 25.0) * 100;
    }

    incrCounter() {
        let formValue = this.spaceForm.value;
        // if(this.section <= 3 || this.section==6 || (this.section>=12 && this.section<=14))
        if (this.section == 1) {
            let errorText = document.getElementById('capacity');
            if (errorText && formValue.capacity > 0) errorText.classList.add('d-none');
            else if (errorText) {
                errorText.classList.remove('d-none');
                return;
            }
        } else if (this.section == 2) {
            let errorText = document.getElementById('area');
            if (errorText && formValue.area > 0) errorText.classList.add('d-none');
            else if (errorText) {
                errorText.classList.remove('d-none');
                return;
            }
        } else if (this.section == 3) {
            let errorText = document.getElementById('formatted_address');
            if (errorText && formValue.formatted_address) errorText.classList.add('d-none');
            else if (errorText) {
                errorText.classList.remove('d-none');
                return;
            }
        } else if (this.section == 6) {
            let errorText1 = document.getElementById('name');
            if (errorText1 && formValue.name) errorText1.classList.add('d-none');
            else if (errorText1) {
                errorText1.classList.remove('d-none');
                return;
            }

            let errorText2 = document.getElementById('description');
            if (errorText2 && formValue.description) errorText2.classList.add('d-none');
            else if (errorText2) {
                errorText2.classList.remove('d-none');
                return;
            }
        } else if (this.section == 12) {
            let errorText = document.getElementById('notice_period');
            if (errorText && formValue.notice_period > 0) errorText.classList.add('d-none');
            else if (errorText) {
                errorText.classList.remove('d-none');
                return;
            }
        } else if (this.section == 13) {
            this.operatingHoursFlag = false;
            for (let hour of this.operating_hours) {
                if (hour['isOpen']) this.operatingHoursFlag = true;
            }
            if (!this.operatingHoursFlag) return;
        } else if (this.section == 14) {
            if (formValue.catering_mandatory) {
                let errorText2 = document.getElementById('amount');
                let errorText = document.getElementById('inclHours');
                if (errorText2 && formValue.min_catering_amount > 0) errorText2.classList.add('d-none');
                else if (errorText2) {
                    errorText2.classList.remove('d-none');
                    return;
                }

                if (errorText && formValue.included_hours > 0) errorText.classList.add('d-none');
                else if (errorText) {
                    errorText.classList.remove('d-none');
                    return;
                }
            } else {
                let errorText = document.getElementById('price');
                if (errorText && formValue.price > 0) errorText.classList.add('d-none');
                else if (errorText) {
                    errorText.classList.remove('d-none');
                    return;
                }
            }
        }
        ++this.section;

        if (this.section > 6) {
            this.setStatus('incomplete');
        }

        if (this.section == 5 && !this.secondSectionTouched) this.secondSectionTouched = true;
        if (this.section == 12 && !this.thirdSectionTouched) this.thirdSectionTouched = true;
    }

    decrCounter() {
        if (this.section > 1) {
            --this.section;
        }
    }

    deleteImageFromAws(image, index) {
        console.log(image);
        try {
            this.awsServices.deleteFile(image['key'], {}).then((data) => {
                this.spaceForm.value.images.splice(index, 1);
            })
        } catch (err) {
            console.log(err);
        }
    }

    setStatus(status) {
        this.spaceForm.patchValue({
            status: status
        });
        this.uploadToAws();
    }

    async showAlert(message, status) {
        const alert = await this.alertController.create({
            header: 'Are you sure?',
            message: message,
            buttons: [
                {
                    text: 'No, go back',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {

                    }
                }, {
                    text: "Yes I'm sure",
                    handler: () => {
                        this.setStatus(status);
                    }
                }
            ]
        });

        await alert.present();
    }

    async uploadToAws() {
        for (let i = 0; i < this.imagesData.length; i++) {
            let file = this.imagesData[i];
            try {
                const file_ext = file["name"].split(".").pop();
                const file_name = new Date().getTime() + "." + file_ext;
                let result = await this.awsServices.uploadFile(file, {
                    file_name: file_name,
                    s3_path: "spaces"
                })
                console.log(result);
                this.spaceForm.value.images.push({ key: result['key'], Location: result['Location'] });
                this.images.splice(i, 1);
                this.imagesData.splice(i, 1);
            } catch (err) {
                console.log(err);
            }
        }
        this.autoSubmit();
    }

    autoSubmit() {

        this.spaceForm.value.address['address2'] = this.spaceForm.value.address2;

        // let arrayCopy = [];
        // for (let operating_hour of this.operating_hours) {
        //     arrayCopy.push(Object.assign({}, operating_hour));
        // }
        // this.spaceForm.controls['operating_hours'].setValue(arrayCopy);
        // for (let i = 0; i < this.operating_hours.length; i++) {
        //     for (let j = 0; j < this.operating_hours[i]['hours'].length; j++) {
        //         let objValue = this.operating_hours[i]['hours'][j].value
        //         this.spaceForm.value.operating_hours[i]['hours'][j] = Object.assign({}, objValue);
        //     }
        // }
        this.spaceForm.patchValue({
          operating_hours: this.operating_hours
        });

        console.log(this.spaceForm.value);

        if (this.spaceForm.valid) {
            const request = {
                action_url: '/spaces/',
                method: 'POST',
                params: this.spaceForm.value
            };
            if (this.space_id) {
                request['method'] = 'PUT';
                request['params']['space_id'] = this.space_id;
            }

            this.services.doHttp(request).subscribe(
                data => {
                    this.setAnalytics();
                    if (request['method'] == 'POST') this.space_id = data['space_id'];
                    if (this.section == 17 && this.spaceForm.value.status == 'processing') {
                        this.router.navigate(["/my-spaces"]).then(() => {
                            this.services.notification(data["msg"], true);
                        });
                    }
                },
                err => {
                    this.services.errorHandler(err);
                }
            );
        } else {
            this.services.markFormGroupTouched(this.spaceForm);
        }
    }

    submitForm() {
        // this.spaceForm.value.address['address2'] = this.spaceForm.value.address2;

        // this.spaceForm.patchValue({
        //     operating_hours: this.operating_hours
        // });
        // for (let i = 0; i < this.operating_hours.length; i++) {
        //     for (let j = 0; j < this.operating_hours[i]['hours'].length; j++) {
        //         this.spaceForm.value.operating_hours[i]['hours'][j] = this.operating_hours[i]['hours'][j].value;
        //     }
        // }

        if (this.spaceForm.valid) {
            const request = {
                action_url: '/spaces/',
                method: 'POST',
                params: this.spaceForm.value
            };
            if (this.space_id) {
                request['method'] = 'PUT';
                request['params']['space_id'] = this.space_id;
            }
            this.services.presentLoading();
            this.services.doHttp(request).subscribe(data => {
                console.log(data);
                this.services.dismissLoading();
                // if (!this.space_id) {
                //     this.spaceForm.reset();
                // }
                this.router.navigate(["/my-spaces"]).then(() => {
                    this.services.notification(data["msg"], true);
                });
            }, error => {
                console.log(error);
                this.services.dismissLoading();
                this.services.errorHandler(error);
            });
        } else {
            this.services.markFormGroupTouched(this.spaceForm);
        }
    }

    async setAnalytics() {
        let analytics_props: any = {};
        analytics_props['spaceTitle'] = this.spaceForm.value.name;
        analytics_props['spaceType'] = this.spaceForm.value.space_kind;
        analytics_props['location'] = this.spaceForm.value.address;
        try {
        const result = await this.utils.initApp();
            if (result) {
                const userProfile = this.utils.user;
                if(userProfile && userProfile.user_id) {
                    analytics_props['userIdentifier'] = userProfile.user_id;
                } else {
                    analytics_props['userIdentifier'] = "Anonymous";
                }
            }
        } catch(err) {
            analytics_props['userIdentifier'] = "Anonymous";
            console.log(err);
        }

        this.services.addAnalytic({
          action: "CreateSpace",
          properties: analytics_props,
        });
    }

    editSection(section) {
        this.section = section;
        this.agreed = false;
        this.confirmed = false;
    }

    /* -------------- Section 1 Code ---------------- */
    selectType(event) {
        let options = document.getElementsByClassName('option');
        for (let i = 0; i < options.length; i++) {
            options[i].classList.remove('selected');
            options[i].children[0].classList.add('d-none');
        }

        let target = event.target || event.srcElement || event.currentTarget;
        this.spaceForm.patchValue({
            cancellation_policy: target.innerText
        });
        target.classList.add('selected');
        target.children[0].classList.remove('d-none');
    }

    incrGuestCounter() {
        this.spaceForm.patchValue({
            capacity: ++this.spaceForm.value.capacity
        });
    }
    decrGuestCounter() {
        if (this.spaceForm.value.capacity <= 0) return;
        this.spaceForm.patchValue({
            capacity: --this.spaceForm.value.capacity
        });
    }

    toggleFullSpace(event) {
        this.spaceForm.patchValue({
            is_allow_full_space_for_rent: event.target.checked
        });
    }

    /* -------------- Section 2 Code ---------------- */
    incrRoomsCounter() {
        this.spaceForm.patchValue({
            rooms: ++this.spaceForm.value.rooms
        });
    }
    decrRoomsCounter() {
        if (this.spaceForm.value.rooms <= 0) return;
        this.spaceForm.patchValue({
            rooms: --this.spaceForm.value.rooms
        });
    }

    incrRestRoomsCounter() {
        this.spaceForm.patchValue({
            rest_rooms: ++this.spaceForm.value.rest_rooms
        });
    }
    decrRestRoomsCounter() {
        if (this.spaceForm.value.rest_rooms <= 0) return;
        this.spaceForm.patchValue({
            rest_rooms: --this.spaceForm.value.rest_rooms
        });
    }

    incrFloorCounter() {
        this.spaceForm.patchValue({
            floor_no: ++this.spaceForm.value.floor_no
        });
    }
    decrFloorCounter() {
        if (this.spaceForm.value.floor_no <= 0) return;
        this.spaceForm.patchValue({
            floor_no: --this.spaceForm.value.floor_no
        });
    }

    /* -------------- Section 3 Code ---------------- */
    handleAccessibility(event, access) {
        if (event.checked) {
            this.spaceForm.value.accessibility.push(access);
        } else {
            let index = this.spaceForm.value.accessibility.indexOf(access);
            if (index !== -1) this.spaceForm.value.accessibility.splice(index, 1);
        }
        this.updateProgress();
    }

    checkAccessibility(access) {
        if (this.spaceForm.value.accessibility.indexOf(access) == -1) return false;
        return true
    }

    /* -------------- Section 3 Code ---------------- */
    // renderMap() {
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //       zoom: 11,
    //       maxZoom: 14,
    //       center: new google.maps.LatLng(17.4082338, 78.4467743),
    //       mapTypeId: google.maps.MapTypeId.ROADMAP
    //     });
    // }

    setAddressFormValues(address: { [key: string]: any }) {
        this.spaceForm.controls.address.patchValue({
            city: address['city'],
            formatted_address: address['formatted_address'],
            lat: address['lat'],
            lng: address['lng'],
            name: address['name'],
            place_id: address['place_id'],
            postalcode: address['postalcode'],
            state: address['state'],
            street_address: address['street_address'] ? address['street_address'] : null,
            country: address['country'],
            area: address['sublocality'],
        });
        this.spaceForm.patchValue({
            'formatted_address': address['formatted_address']
        });
        this.lat = address['lat'];
        this.lng = address['lng'];
    }

    useCurrentLocation() {
        this.services.presentLoading();
        this.maps.getUserCurrentPosition().then((location) => {
            console.log('location', location);
            this.maps.getGeocodeDetails(location).then((address: Address) => {
                this.setAddressFormValues(address);
                this.services.dismissLoading();
            }, (err) => {
                this.services.dismissLoading();
            });
        }, (err) => {
            this.services.dismissLoading();
        });
    }

    public handleAddressChange(place: any) {
        let address = this.maps.getFormatAddress(place);
        address['lat'] = place.geometry.location.lat();
        address['lng'] = place.geometry.location.lng();
        this.setAddressFormValues(address);
        console.log('address', address);
    }

    /* -------------- Section 5 Code ---------------- */
    handleAmenities(event, amenity) {
        if (event.checked) {
            this.spaceForm.value.amenities.push(amenity);
        } else {
            let index = this.spaceForm.value.amenities.indexOf(amenity);
            if (index !== -1) this.spaceForm.value.amenities.splice(index, 1);
        }
        this.updateProgress();
    }

    checkAmenities(amenity) {
        if (this.spaceForm.value.amenities.indexOf(amenity) == -1) return false;
        return true
    }

    showImage(files) {
        let filesArray = Array.from(files);
        for (let x in filesArray) {
            this.imagesData.push(filesArray[x]);
            let elem = window.URL.createObjectURL(filesArray[x]);
            this.images.push(elem);
        }
    }

    deleteImage(index) {
        this.imagesData.splice(index, 1);
        this.images.splice(index, 1);
    }

    getImages(event) {
        event.preventDefault();
        this.showImage(event.dataTransfer.files);
    }

    handleDrag(event) {
        event.preventDefault();
    }

    /* -------------- Section 9 Code ---------------- */
    handleServices(event, service) {
        if (event.checked) {
            this.spaceForm.value.services.push(service);
        } else {
            let index = this.spaceForm.value.services.indexOf(service);
            if (index !== -1) this.spaceForm.value.services.splice(index, 1);
        }
    }

    /* -------------- Section 10 Code ---------------- */
    handleRules(event, rule) {
        if (event.checked) {
            this.spaceForm.value.space_rules.push(rule);
        } else {
            let index = this.spaceForm.value.space_rules.indexOf(rule);
            if (index !== -1) this.spaceForm.value.space_rules.splice(index, 1);
        }
        this.updateProgress();
    }

    checkRules(rule) {
        if (this.spaceForm.value.space_rules.indexOf(rule) == -1) return false;
        return true
    }

    /* -------------- Section 12 Code ---------------- */
    incrNoticePeriod() {
        this.spaceForm.patchValue({
            notice_period: ++this.spaceForm.value.notice_period
        });
    }

    decrNoticePeriod() {
        if (this.spaceForm.value.notice_period <= 1) return;
        this.spaceForm.patchValue({
            notice_period: --this.spaceForm.value.notice_period
        });
    }

    /* -------------- Section 14 Code ---------------- */
    incrMinHours() {
        this.spaceForm.patchValue({
            min_hours: ++this.spaceForm.value.min_hours
        });
    }

    decrMinHours() {
        if (this.spaceForm.value.min_hours <= 0) return;
        this.spaceForm.patchValue({
            min_hours: --this.spaceForm.value.min_hours
        });
    }

    incrIncludedHours() {
        this.spaceForm.patchValue({
            included_hours: ++this.spaceForm.value.included_hours
        });
    }

    decrIncludedHours() {
        if (this.spaceForm.value.included_hours <= 0) return;
        this.spaceForm.patchValue({
            included_hours: --this.spaceForm.value.included_hours
        })
    }

    selectBox(event, time) {
        let elem = event.target
        // let event_start_date = new Date(this.selectedDate.date()+ "-" + this.selectedDate.month() + "-" + this.selectedDate.year(), "DD-MM-YYYY HH:mm")
        if (elem.classList.contains('selected')) {
            elem.classList.remove('selected');
            // if(this.selectedDate.toISOString() in this.blockedTimes) 
            //     this.blockedTimes[this.selectedDate.toISOString()].push()
        }
        else {
            elem.classList.add('selected');
        }
    }

    selectAll() {
        let elems = document.getElementsByClassName('boxes');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.add('selected');
        }
    }

    deselectAll() {
        let elems = document.getElementsByClassName('boxes');
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove('selected');
        }
    }

    selectDate(event) {
        this.showTimings = true;
        this.selectedDate = event.mDate._d;
        console.log(event);
    }

    toggleAvailability(event, i) {
        // let elems = document.getElementsByClassName('day-details');
        // for(let i=0; i<elems.length; i++) {
        //     elems[i].classList.add('d-none');
        // }
        // if(event.checked) {
        //     document.getElementById(day).classList.remove('d-none');
        // }
        // this.operatingDays[day] = event.checked;
        this.operating_hours[i]['isOpen'] = event.checked;
        this.operatingHoursFlag = false;
        for (let hour of this.operating_hours) {
            if (hour['isOpen']) this.operatingHoursFlag = true;
        }
    }

    openDetails(day) {
        if (this.operatingDays[day]) {
            let elems = document.getElementsByClassName('day-details');
            for (let i = 0; i < elems.length; i++) {
                elems[i].classList.add('d-none');
            }
            document.getElementById(day).classList.remove('d-none');
        }
    }

    toggleTimes(event, index) {
        if (event.value == 2) {
            this.operating_hours[index]['allDay'] = false;
        } else {
            this.operating_hours[index]['allDay'] = true;
        }
    }

    /* -------------- Section 15 Code ---------------- */
    handleTypes(event, type) {
        if (event.checked) {
            this.spaceForm.value.space_type.push(type);
        } else {
            let index = this.spaceForm.value.space_type.indexOf(type);
            if (index !== -1) this.spaceForm.value.space_type.splice(index, 1);
        }
        this.updateProgress();
    }

    checkTypes(type) {
        if (this.spaceForm.value.space_type.indexOf(type) == -1) return false;
        return true
    }

    incrHoldingPeriod() {
        this.spaceForm.patchValue({
            holding_period: ++this.spaceForm.value.holding_period
        });
    }

    decrHoldingPeriod() {
        if (this.spaceForm.value.holding_period <= 1) return;
        this.spaceForm.patchValue({
            holding_period: --this.spaceForm.value.holding_period
        });
    }

    calculateTax() {
        // if (this.spaceForm.value.price) {
        //     let tax_rates = this.space_data.tax_rate;
        //     let pricePerNight = this.spaceForm.value.price * 12;

        //     for (let rateObj of tax_rates) {
        //         if (pricePerNight < rateObj.max_value) {
        //             this.spaceForm.patchValue({
        //                 tax: rateObj.tax_rate
        //             });
        //             this.showTaxMessage = true;
        //             break;
        //         }
        //     }
        // } else {
        //     this.spaceForm.patchValue({
        //         tax: null
        //     });
        //     this.showTaxMessage = false;
        // }
    }

    checkPolicy() {
        let selectedPolicy = this.spaceForm.value.cancellation_policy;
        for (let policy of this.space_data.cancellation_policy) {
            if (selectedPolicy != null && typeof selectedPolicy == 'object' && 'title' in selectedPolicy && selectedPolicy.title == policy.title) {
                policy.selected = true;
            } else {
                policy.selected = false;
            }
        }
    }

    selectPolicy(index) {
        for (let policy of this.space_data.cancellation_policy) {
            policy.selected = false;
        }
        this.space_data.cancellation_policy[index].selected = true;
        this.spaceForm.patchValue({
            cancellation_policy: this.space_data.cancellation_policy[index]
        });
    }

    handleInvalidData(event) {
        if (!((event.keyCode > 95 && event.keyCode < 106)
            || (event.keyCode > 47 && event.keyCode < 58)
            || event.keyCode == 8)) {
            return false;
        }
    }

    handlePaste(event) {
        event.preventDefault();
    }

    checkCatering(event) {
        this.spaceForm.patchValue({
            catering_mandatory: JSON.parse(event.value)
        });
    }
}