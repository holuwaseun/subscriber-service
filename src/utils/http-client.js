'use strict';

const requestAgent = require('axios');
const qs = require('qs');

module.exports = () => {
  return () => (
    {
      headers: {
        'User-Agent': 'axios',
      },

      setHeaders({headers = {}}) {
        this.headers = headers;
        return this;
      },

      async get({url, filter = null}) {
        try {
          const options = {
            method: 'GET',
            url,
            params: filter,
            headers: {...this.headers},
            responseType: 'JSON',
          };

          const {data} = await requestAgent({...options});
          return data;
        } catch (error) {
          throw error;
        }
      },

      async post({url, payload = null}) {
        try {
          if (
            this.headers.hasOwnProperty('Content-Type') &&
            this.headers['Content-Type']
                .indexOf('application/x-www-form-urlencoded') > -1
          ) {
            payload = qs.stringify(payload);
          }

          const options = {
            method: 'POST',
            url,
            data: payload,
            headers: {...this.headers},
            responseType: 'JSON',
          };

          const {data} = await requestAgent({...options});
          return data;
        } catch (error) {
          throw error;
        }
      },

      async put({url, payload = null}) {
        try {
          const options = {
            method: 'PUT',
            url,
            data: payload,
            headers: {...this.headers},
            responseType: 'JSON',
          };

          const {data} = await requestAgent({...options});
          return data;
        } catch (error) {
          throw error;
        }
      },

      async del({url, filter = null}) {
        try {
          const options = {
            method: 'DELETE',
            url,
            params: filter,
            headers: {...this.headers},
            responseType: 'JSON',
          };

          const {data} = await requestAgent({...options});
          return data;
        } catch (error) {
          throw error;
        }
      },
    }
  );
};
