// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  scope: "eventoloop",
  version: "1.0.2",
  env: "staging",
  cookiePath: "/",
  cookieDomain: ".thesurprisegift.com",
  cookieSecure: true,
  title: "Surprise Gift | Invites",
  site_icon: "https://invites.thesurprisegift.com/assets/invites-logo.png",
  site_url: "https://thesurprisegift.com/",
  invites_url: "https://invites.thesurprisegift.com/",
  service_url: "https://api.thesurprisegift.com/v1",
  socket_url: 'https://thesurprisegift.com/',
  api_prefix: "/in",
  pwa_url: "https://m.thesurprisegift.com/",
  user: "SG_USER",
  country: "india",
  country_code: "in",
  carrier_code: "in",
  currency: "₹",
  secret_key: "14EB30C355D14D258E78F52B1618EAF7",
  token: "SG_TOKEN",
  mixpanel_token: "63b8bbe8df4ba7f5477d59103b52c529",
  spinner: "<i class='fa fa-spinner fa-spin'></i>&nbsp;",
  vat: 20,
  shipping_rate: 4.99,
  errorImage: "assets/product/no-image-200x200-72.png",
  defaultImage: "assets/product/no-image-200x200-72.png",
  occasionImage: "assets/image/default-occasion.png",
  scroll_distance: 1,
  scroll_throttle: 500,
  user_role: "user",
  size: 10,
  offset: 0,
  map_key: "AIzaSyBEpFWxzL5xK-S5tW8x8euGHi9sqe60XYA",
  max_guests: 10,
  s3Bucket: {
    accessKeyId: "AKIAIKNJVK5JW6RIAQHA",
    secretAccessKey: "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",
    region: "us-west-2",
    Bucket: "invites-us-staging"
  },
  firebase: {
    apiKey: "AIzaSyDt3g4Sjli9v8anhoWXeIwYXJHUwVf_WEU",
    authDomain: "surprisegift-23e1c.firebaseapp.com",
    databaseURL: "https://surprisegift-23e1c.firebaseio.com",
    projectId: "surprisegift-23e1c",
    storageBucket: "surprisegift-23e1c.appspot.com",
    messagingSenderId: "651648164784"
  },
  support_email: "support@surprisegift.co.in",
  play_store_link:
    "https://play.google.com/store/apps/details?id=invites.surprisegift.in&hl=en",
  app_store_link:
    "https://play.google.com/store/apps/details?id=invites.surprisegift.in&hl=en",
  facebook_page_id: 1052215964872786,
  iso_code: "IND",
  countries: [
    {
      text: "+1",
      country_code: "US"
    },
    {
      text: "+91",
      country_code: "IN"
    }
  ],
  countriesArray: ["USA", "IND"]
};
