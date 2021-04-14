import {CinchyConfig} from '@cinchy-co/angular-sdk';

// ng build --prod --base-href "/dx/cinchy-calendar/"
const cinchyConfig: CinchyConfig = {
  authority: 'https://cinchy.net/cinchysso',
  cinchyRootUrl: 'https://cinchy.net/Cinchy',
  clientId: 'cinchy-calendar-prod',
  redirectUri: 'https://cinchy.net/dx/cinchy-calendar'
};


// PROD
/*"authority": "https://cinchy.net/cinchysso",
  "cinchyRootUrl": "https://cinchy.net/Cinchy",
  "clientId": "cinchy-calendar-prod",
  "redirectUri": "https://cinchy.net/dx/cinchy-calendar",
  "version": "1.0.0"*/
export const environment = {
  production: true,
  cinchyConfig
};
