export interface EventsType {
  occasion_name: string;
  occasion_id: string;
  image: string;
}

export interface IUserJson {
  dob: string;
  gender: string;
  firstName: string;
  lastName: string;
  carrier_code: string;
}

export interface IUserProfile {
  user_id: string;
  email: string;
  mobile: string;
  address: string;
  user_json: IUserJson;
  carrier_code: string;
  user_image: any;
  user_name: any;
}

export interface ICities {
  city: string;
}

export interface BookingInfo {
  space_id: string;
  space_name?: any;
  capacity: number;
  guests?: number;
  event_start_date: string;
  event_end_date: string;
  is_cancelled: boolean;
  service_fee?: number;
  gst?: number;
  sub_total?: number;
  discount?: number;
  sub_total_after_discount?: number;
  grand_total_before_coupon?: any;
  grand_total?: number;
  razorpay_payment_id?: string;
  occasion_name?: string;
  cart?: any;
  cart_total?: any;
  cart_discount?: any;
  cart_total_after_discount?: any;
  cart_added?: any;
  catering_mandatory?: any;
  service_tax?: any;
  gst_tax?: any;
  booking_id?: any;
  coupon?: any;
}

export interface SpaceType {
  accessibility?: Array<string>;
  address?: { [key: string]: any };
  amenities?: Array<string>;
  cancellation_policy?: any;
  capacity?: string | number;
  created_at?: string;
  description?: string;
  images?: string;
  name?: string;
  price?: string | number;
  price_info?: string;
  services?: Array<string>;
  space_id?: string;
  space_rules?: Array<string>;
  space_type?: Array<string>;
  status?: string;
  user_id?: string;
  booking_dates?: Array<{
    event_end_date: string;
    event_start_date: string;
  }>;
  min_hours?: any,
  host_name?: any,
  avg_response_time?: any
  overall_ratings?: any
  catering_available?: boolean;
  catering_mandatory?: boolean;
  has_menu?: boolean;
  allow_multiple_catering_packages?: boolean;
  is_allow_full_space_for_rent?: boolean;
  discount?: any
}

export interface HostBookingDetails {
  event_end_date: string;
  position?: number;
  event_start_date: string;
  user_email: string;
  user_id?: string;
  user_mobile: string;
  user_name: string;
  status: string;
}

export interface IAWSParams {
  file_name?: string;
  s3_path?: string;
}
