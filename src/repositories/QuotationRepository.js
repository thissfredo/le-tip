import client from './Client';

export default {
    get(payload) {
        return client.get(`${payload.base_currency}-${payload.quote_currency}`);
    },
};