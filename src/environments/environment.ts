import {CinchyConfig} from '@cinchy-co/angular-sdk';

const cinchyConfig: CinchyConfig = {
  authority: 'https://cinchy.net/cinchysso',
  cinchyRootUrl: 'https://cinchy.net/Cinchy',
  clientId: 'cinchy-calendar',
  redirectUri: 'https://localhost:4200/'
};

export const environment = {
  production: false,
  cinchyConfig
};
