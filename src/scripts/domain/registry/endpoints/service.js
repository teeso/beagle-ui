import composeClass from 'compose-class';
import Symbol from 'es6-symbol';
import get from 'lodash/get';
import map from 'lodash/map';
import constant from 'lodash/constant';
import isEmpty from 'lodash/isEmpty';
import { List } from 'immutable';
import { requires } from '../../../infrastructure/utils/contracts';
import isImmutable from '../../../infrastructure/utils/is-immutable';
import Endpoint from './endpoint';

const NO_RETURN = constant(null);

const FIELDS = {
    http: Symbol('http')
};

const EndpointsService = composeClass({
    constructor(http) {
        requires('http', http);

        this[FIELDS.http] = http;
    },

    find(query) {
        return this[FIELDS.http].execute({
            method: 'GET',
            url: 'registry/endpoints',
            params: {
                take: get(query, 'take', 10),
                skip: get(query, 'skip', 0)
            }
        }).then((res) => {
            return List(map(res.body, i => Endpoint(i)));
        });
    },

    get(id) {
        return this[FIELDS.http].execute({
            method: 'GET',
            url: `registry/endpoints/${id}`
        }).then((res) => {
            if (isEmpty(res.body)) {
                return null;
            }

            return Endpoint(res.body);
        });
    },

    create(endpoint) {
        if (isEmpty(endpoint) || !isImmutable(endpoint)) {
            return Promise.reject(new Error('Invalid model'));
        }

        return this[FIELDS.http].execute({
            method: 'POST',
            url: 'registry/endpoints',
            data: endpoint.toJS()
        }).then((res) => {
            return endpoint.set('id', res.body);
        });
    },

    save(endpoint) {
        if (isEmpty(endpoint) || !isImmutable(endpoint)) {
            return Promise.reject(new Error('Invalid model'));
        }

        return this[FIELDS.http].execute({
            method: 'PUT',
            url: 'registry/endpoints',
            data: endpoint.toJS()
        }).then(NO_RETURN);
    },

    delete(id) {
        if (id < 0) {
            return Promise.reject(new Error('Invalid id'));
        }

        return this[FIELDS.http].execute({
            method: 'PUT',
            url: `registry/endpoints/${id}`
        }).then(NO_RETURN);
    }
});

export default function create(...args) {
    return new EndpointsService(...args);
}