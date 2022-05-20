import {Room} from "../../model/messenger/room/Room";
import {AppDispatch} from "../../index";
import {Dispatch, SetStateAction} from "react";
import Immutable from "immutable";
import {MessageEntity} from "../../model/messenger/message/MessageEntity";
import {User} from "../../model/User";
import {RoomService} from "./room/RoomService";
import {setMessagesToState, setRoomMembersToState, setRoomsToState} from "../../redux/messenger/messengerActions";
import {MessageService} from "./message/MessageService";
import {RoomType} from "../../model/messenger/room/RoomType";
import {retrieveUserId} from "../authService";
import {ChatSearchOption, ChatSearchOptionType} from "../../model/messenger/chatSearchOptiom/ChatSearchOption";
import {findUsersPerPage} from "../userService";
import {SearchRoom} from "../../model/messenger/room/SearchRoom";

export class MessengerService {

    static openRoom(room: Room,
                    dispatch: AppDispatch,
                    setRoom: Dispatch<SetStateAction<Room>>,
                    rooms: Room[],
                    roomMembers: Immutable.Map<number, User[]>) {

        let modifiedRooms = MessengerService.setAmountToZero(rooms, room.id);
        dispatch(setRoomsToState(modifiedRooms));

        RoomService.updateLastSeenAt(room.id)
            .then(() =>
                MessengerService.fetchMessages(room, dispatch, setRoom, roomMembers)
            )
    }

    private static setAmountToZero(rooms: Room[], roomId: number) {
        let roomsToModify = new Array<Room>(...rooms);
        roomsToModify.map(s => {
            if (s.id === roomId) {
                s.amount = 0;
            }
        });
        return roomsToModify;
    }

    private static fetchMessages(room: Room,
                                 dispatch: AppDispatch,
                                 setRoom: Dispatch<SetStateAction<Room>>,
                                 roomMembers: Immutable.Map<number, User[]>) {
        Promise.all([
            MessageService.getMessageHistory(room.id, 0, 20),
            RoomService.getUsersOfRoom(room.id)
        ]).then(([messagesResp, usersResp]) => {
            setRoom(room);

            const roomMembersMap = new Map(roomMembers).set(room.id, usersResp.data);
            dispatch(setRoomMembersToState(Immutable.Map(roomMembersMap)));

            const messagesMap = new Map().set(room.id, messagesResp.data.content.reverse());
            dispatch(setMessagesToState(Immutable.Map(messagesMap)));
        })
    }

    static generateMessageInfo(message: MessageEntity) {
        const messageDate = new Date(message.createdAt).toLocaleTimeString();
        return `${messageDate} | ${message.senderTitle}`;
    }

    static retrieveRoomTitle(room: Room) {
        if (room?.roomType === RoomType.PRIVATE) {
            const parsedTitle = JSON.parse(room.title) as string[];
            const splitTitle = parsedTitle.map(titleArrayElement => titleArrayElement.split(":"));

            return Number(splitTitle[0][0]) === retrieveUserId() ? splitTitle[1][1] : splitTitle[0][1];
        }

        return room?.title;
    }

    static promiseOptions (inputValue: string): Promise<ChatSearchOption[]> {
        let rooms = RoomService.findRoomsWithSpecificUser(inputValue, RoomType.PRIVATE);
        let users = findUsersPerPage(0, 20, {title: inputValue})
        return Promise.all([rooms, users]).then(
            ([rooms, users]) => {
                let options: ChatSearchOption[] = new Array<ChatSearchOption>();
                options = options.concat(rooms.data.map(room => new ChatSearchOption(ChatSearchOptionType.ROOM, room)));
                let ids = MessengerService.usersIHaveAlreadyHadPrivateChatsWithIds(rooms.data);
                let filteredUsers = users.data.content.filter(s => (!ids.includes(s.id)));
                options = options.concat(filteredUsers.map(user => new ChatSearchOption(ChatSearchOptionType.USER, user)));
                return options;
            }
        )
    }

    static generateOptionLabel(option: ChatSearchOption) {

        switch (option.type) {
            case ChatSearchOptionType.ROOM:
                let s = MessengerService.retrieveRoomTitle(option.payload as Room);
                console.log('label' + s);
                return 'Existing chat: ' + s;

            case ChatSearchOptionType.USER:
                return 'Start chat with: ' + option.payload.title;

            default:
                return 'Unexpected option type';
        }
    }

    static createPrivateRoomWith(invitedId: number) {
        RoomService.createRoom({userId: invitedId, isPrivate: true}).then();
    }

    private static usersIHaveAlreadyHadPrivateChatsWithIds(myPrivateRooms: SearchRoom[]) {
        let myId = retrieveUserId();
        let result = myPrivateRooms.flatMap(s => s.participants).map(s => s.id).filter(s => s !== myId);
        result.push(myId);
        return result;
    }
}