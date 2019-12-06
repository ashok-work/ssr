import {Injectable} from '@angular/core';

@Injectable()
export class ConfigService {
    public config = {};
    public validations = {
        email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
        mobile: /^\d{10}$/,
        gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        pan_card: /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/
    };

    constructor() {
        this.config['env'] = 'development'; //development, testing, production
        this.config['site_url'] = 'http://ec2-34-214-178-206.us-west-2.compute.amazonaws.com:4000/';
        this.config['service_url'] = 'http://ec2-34-214-178-206.us-west-2.compute.amazonaws.com:3000/api/v1/';
        this.config['api_prefix'] = '/in';
        this.config['pwa_url'] = 'http://ec2-34-214-178-206.us-west-2.compute.amazonaws.com:3000/';
        this.config['country'] = 'india';
        this.config['currency'] = '₹';
        this.config['secret_key'] = '14EB30C355D14D258E78F52B1618EAF7';
        this.config['title'] = 'Surprise Gift | India';
        this.config['errorImage'] = 'assets/product/no-image-200x200-72.png';
        this.config['defaultImage'] = 'assets/product/no-image-200x200-72.png';
        this.config['token'] = 'sg_merchant_token';
        this.config['user'] = 'sg_merchant_profile';
        if (this.config['env'] === 'production') {
            this.config['site_url'] = "http://surprisegift.co.in/";
            this.config['service_url'] = this.config['site_url'] + 'api/v1';
            this.config['upload_url'] = this.config['site_url'];
        } else if (this.config['env'] === 'testing') {
            this.config['site_url'] = 'http://ec2-34-214-178-206.us-west-2.compute.amazonaws.com:3000/';
            this.config['service_url'] = 'http://ec2-34-214-178-206.us-west-2.compute.amazonaws.com:3000/api/v1/';
            this.config['upload_url'] = this.config['site_url'];
        } else {
            this.config['site_url'] = 'http://localhost:4200/';
            this.config['upload_url'] = this.config['site_url'];
            this.config['service_url'] = 'http://localhost:3000/api/v1/';
            this.config['api_prefix'] = '';
        }
        console.log(JSON.stringify(this.config));
    }
}
