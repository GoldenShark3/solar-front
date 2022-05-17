import {Room} from "../../model/messenger/room/Room";
import {MessageEntity} from "../../model/messenger/message/MessageEntity";
import {User} from "../../model/User";
import {IDefaultStateField, IPlainDataAction, IReduxPromiseAction} from "../redux-types";
import Immutable from "immutable";

interface IMessengerState {
    rooms: Room[];
    messages: Immutable.Map<number, MessageEntity[]>
    roomMembers: Immutable.Map<number, User[]>
}

export type TMessengerState = IMessengerState & IDefaultStateField;

export type TMessengerAction = IReduxPromiseAction<Room[]> | IPlainDataAction<any>;

export const SET_ROOMS = 'SET_ROOMS';
export const SET_MESSAGES = 'SET_MESSAGES';
export const FETCH_ROOMS = 'FETCH_ROOMS';
export const SET_ROOM_MEMBERS = 'SET_ROOM_MEMBERS';
