import {Room} from "../../model/messenger/room/Room";
import {AppDispatch} from "../../index";
import {Dispatch, SetStateAction} from "react";
import Immutable from "immutable";
import {MessageEntity} from "../../model/messenger/message/MessageEntity";
import {User} from "../../model/User";
import {RoomService} from "./RoomService";
import {setMessagesToState, setRoomMembersToState} from "../../redux/messenger/messengerActions";
import {MessageService} from "./MessageService";
import {RoomType} from "../../model/messenger/room/RoomType";
import {retrieveUserId} from "../authService";
import {ChatSearchOption, ChatSearchOptionType} from "../../model/messenger/chatSearchOptiom/ChatSearchOption";
import {findUsersPerPage} from "../userService";
import {SearchRoom} from "../../model/messenger/room/SearchRoom";

export class MessengerService {

    static fetchMessages(room: Room,
                         dispatch: AppDispatch,
                         setRoom: Dispatch<SetStateAction<Room>>,
                         messages: Immutable.Map<number, MessageEntity[]>,
                         roomMembers: Immutable.Map<number, User[]>
    ) {
        Promise.all([
            RoomService.updateLastSeenAt(room.id),
            MessageService.getMessageHistory(room.id, 0, 20),
            RoomService.getUsersOfRoom(room.id)
        ]).then(([lastSeenAtResp, messagesResp, usersResp]) => {
            setRoom(room);

            const roomMembersMap = new Map(roomMembers).set(room.id, usersResp.data);
            dispatch(setRoomMembersToState(Immutable.Map(roomMembersMap)));

            const messagesMap = new Map(messages).set(room.id, messagesResp.data.content.reverse());
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
                let ids = usersIHaveAlreadyHadPrivateChatsWithIds(rooms.data);
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
}

function usersIHaveAlreadyHadPrivateChatsWithIds(myPrivateRooms: SearchRoom[]) {
    let myId = retrieveUserId();
    let result = myPrivateRooms.flatMap(s => s.participants).map(s => s.id).filter(s => s !== myId);
    result.push(myId);
    return result;
}