let baseRootApi = 'https://digilearn-backend.herokuapp.com';

function configBaseApi() {
  if (process.env.REACT_APP_NODE_ENV === 'development') {
    // eslint-disable-next-line no-restricted-globals
    baseRootApi = `${location.protocol}//${location.hostname}:8080`;
  }
  return baseRootApi;
}

export default {
  baseRootApi: configBaseApi(),
};
