let baseRootApi = 'https://digilearn-backend.herokuapp.com';
let baseWebApp = 'https://digilearn-frontend.herokuapp.com';

function configBaseApi() {
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    // eslint-disable-next-line no-restricted-globals
    baseRootApi = `${location.protocol}//${location.hostname}:8080`;
  }
  return baseRootApi;
}

function configBaseWebApp() {
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    // eslint-disable-next-line no-restricted-globals
    baseWebApp = `${location.protocol}//${location.hostname}:3000`;
  }
  return baseWebApp;
}

export default {
  baseRootApi: configBaseApi(),
  baseWebApp: configBaseWebApp(),
};
