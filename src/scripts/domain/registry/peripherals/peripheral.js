import { Record, List } from 'immutable';
import merge from 'lodash/merge';
import map from 'lodash/map';
import Subscriber from './subscriber';

const IBeaconPeripheral = Record({
    id: 0,
    kind: null,
    name: null,
    uuid: null,
    major: null,
    minor: null,
    enabled: false,
    subscribers: null
}, 'IBeaconPeripheral');

export default function create(values) {
    return new IBeaconPeripheral(merge(values, {
        subscribers: List(map(values.subscribers, Subscriber))
    }));
}
