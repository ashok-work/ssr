import {Injectable} from '@angular/core';
// import 'rxjs/add/operator/map';
import {HttpClient, HttpHeaders, HttpParams, HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';

/*
 Generated class for the Maps provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
declare var google: any;

@Injectable()
export class Maps {

    public autocomplete: any = {
        query: ''
    };
    public address: string;
    public autocompleteItems: any;
    public componentForm: Object = {
        street_number: 'long_name',
        route: 'long_name',
        locality: 'long_name',
        sublocality: "long_name",
        sublocality_level_1: 'long_name',
        sublocality_level_2: 'long_name',
        sublocality_level_3: 'long_name',
        administrative_area_level_1: 'long_name',
        administrative_area_level_2: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    /**
     * Maps Provoder constructoor
     * @param http
     * @param services
     * @param user
     * @param log
     */
    constructor(public http: HttpClient) {
        console.info('Map Provider');
    }

    /**
     * get user cureent position lat/lon
     * @returns {Promise<T>}
     */
    public getUserCurrentPosition() {
        return new Promise(
            function (resolve, reject) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve({
                        "lat": position['coords']['latitude'],
                        "lng": position['coords']['longitude']
                    });
                }, (error) => {
                    console.error('Error getting location', error);
                    alert('Sorry we unable to fetch your location.Please enter you location');
                    reject(error);
                });
            });
    }

    public getFormatAddress(place) {
        let address = {};
        for (let i = 0; i < place.address_components.length; i++) {
            for (let j = 0; j < place.address_components[i].types.length; j++) {
                let addressType = place.address_components[i].types[j];
                if (this.componentForm[addressType]) {
                    console.log(addressType);
                    if (addressType === 'premise') { // street
                        address['premise'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'street_number') { // street
                        address['street'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'route') { // street
                        address['route'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'sublocality') { // street
                        address['sublocality'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'sublocality_level_3') { // street
                        address['sublocality_level_3'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'sublocality_level_2') { // street
                        address['sublocality_level_2'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'sublocality_level_1') { // street
                        address['sublocality_level_1'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'administrative_area_level_2') { // city
                        address['city'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'administrative_area_level_1') { // state
                        address['state'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'country') { // postalcode
                        address['country'] = place.address_components[i][this.componentForm[addressType]];
                    }
                    if (addressType === 'postal_code') { // postalcode
                        address['postalcode'] = place.address_components[i][this.componentForm[addressType]];
                    } else {
                        // address[addressType] = place.address_components[i][this.componentForm[addressType]];
                    }
                }
            }
        }
        if (place.hasOwnProperty('name')) {
            address['name'] = place.name;
        } else {
            address['name'] = place.formatted_address;
        }
        // if ("street" in address && 'route' in address) address['street_address'] = address['street'] + " " + address['route'];
        address['formatted_address'] = place.formatted_address;
        address['place_id'] = place.place_id;
        address['source'] = 'location';
        return address;
    }

    public getPlaceDetails(place) {
        const self = this;
        return new Promise(
            function (resolve, reject) {
                self.http.get("https://maps.googleapis.com/maps/api/place/details/json?placeid=" + place.place_id + "&key=" + environment.map_key).subscribe(
                    data => {
                        console.log(data);
                        if (data['status'] === "OK") {
                            let address = self.getFormatAddress(data['result']);
                            address['lat'] = place.geometry.location.lat();
                            address['lng'] = place.geometry.location.lng();
                            resolve(address);
                        }
                    },
                    error => {
                        console.log(error);
                        reject(error);
                    });
            });
    }

    public getGeocodeDetails(latlng) {
        const self = this;
        return new Promise(
            function (resolve, reject) {
                self.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng['lat'] + "," + latlng['lng'] + "&key=" + environment.map_key).subscribe(
                    data => {
                        console.log(data);
                        if (data['status'] === "OK") {
                            if (data['status'] === "OK") {
                                let address = self.getFormatAddress(data['results'][0]);
                                address['lat'] = latlng.lat;
                                address['lng'] = latlng.lng;
                                resolve(address);
                            }
                        }
                    },
                    error => {
                        console.log(error);
                        reject(error);
                    });
            });
    }

}
