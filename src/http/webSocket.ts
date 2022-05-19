import SockJS from "sockjs-client";
import {Client, Message, over} from "stompjs";
import {Room} from "../model/messenger/room/Room";
import {AppDispatch, AppState} from "../index";
import {MessageEntity} from "../model/messenger/message/MessageEntity";
import {MessageType} from "../model/messenger/message/MessageType";
import {ProcessChatMessageService} from "../service/messenger/process-message/processChatMessageService";
import {RoomService} from "../service/messenger/RoomService";
import Immutable from "immutable";
import {setMessagesToState, setRoomsToState} from "../redux/messenger/messengerActions";
import {NotificationService} from "../service/messenger/NotificationService";

export let stompClient: Client = null;

export function connectStompClient(authToken: string, callback: () => void) {
    const sockJS = new SockJS('http://localhost:8081/api/ws', {}, {timeout: -1});
    stompClient = over(sockJS);
    stompClient.connect({'auth_token': authToken}, callback, () => console.log('WEB SOCKET ERROR'));
}

export function subscribeToRooms(rooms: Room[], getState: () => AppState, dispatch: AppDispatch) {
    rooms.forEach(room => {
        stompClient.subscribe(`/room/${room.id}`, (message: Message) => processMessage(message, getState, dispatch));
    })

    stompClient.subscribe('/user/notifications', (notification: Message) => NotificationService.processNotification(notification, getState, dispatch));
}

function processMessage(message: Message, getState: () => AppState, dispatch: AppDispatch) {
    const messageEntity: MessageEntity = JSON.parse(message.body);
    const messageRoomId = messageEntity.roomId;
    const messages = getState().messenger.messages;
    const rooms = getState().messenger.rooms;

    //todo: SYSTEM MESSAGE SEND ONLY ON UPDATE TITLE
    if (messageEntity.messageType === MessageType.SYSTEM) {
        ProcessChatMessageService.updateRoomTitle(messageEntity, rooms, dispatch)
    }

    if (messages.has(messageRoomId)) {
        ProcessChatMessageService.appendOrUpdateMessage(messageEntity, messages, dispatch)
    } else if (messageEntity.messageType !== MessageType.SYSTEM) {
        ProcessChatMessageService.updateUnreadMessageAmount(rooms, messageRoomId, dispatch)
    }
}

export function sendMessage(roomId: number, senderId: number, message: string, editedMessage: MessageEntity) {

    stompClient.send(`/chat/${roomId}`, {}, JSON.stringify({
        id: editedMessage?.id,
        senderId: senderId,
        message: message
    }));
}