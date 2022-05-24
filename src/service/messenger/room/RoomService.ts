import {axiosApi} from "../../../http/axios";
import {SearchRoom} from "../../../model/messenger/room/SearchRoom";
import {CreateRoom} from "../../../model/messenger/room/CreateRoom";
import {Room} from "../../../model/messenger/room/Room";
import {User} from "../../../model/User";

export class RoomService {

    static findRoomsWithSpecificUser(title: string = null, roomType: string = null) {

        return axiosApi.get<SearchRoom[]>('chat/room', {
            params: {
                title: title,
                roomType: roomType
            }
        })
    }

    static createRoom(createRoom: CreateRoom) {

        return axiosApi.post<Room>('chat/room', createRoom);
    }

    static getRoomsWithAmountUnreadMessages() {

        return axiosApi.get<Room[]>('chat/room/user');
    }

    static inviteToRoom(invitedIds: number[], roomId: number) {

        return axiosApi.patch<void>(`chat/room/${roomId}/participants`, {invitedIds: invitedIds});
    }

    static leaveFromRoom(roomId: number) {

        axiosApi.patch<void>(`chat/room/${roomId}/leave`);
    }

    static deleteRoom(roomId: number) {

        axiosApi.delete(`chat/room/${roomId}`);
    }

    static kickUserFromRoom(roomId: number, kickedUserId: number) {

        return axiosApi.delete<void>(`chat/room/${roomId}/participants/${kickedUserId}`);
    }

    static getUsersOfRoom(roomId: number) {

        return axiosApi.get<User[]>(`chat/room/${roomId}/participants`);
    }

    static updateRoomTitle(roomId: number, roomTitle: string) {

        return axiosApi.patch<void>(`chat/room/${roomId}/title`, roomTitle, {headers: {'Content-Type': 'text/plain'}});
    }

    static updateLastSeenAt(roomId: number) {

        return axiosApi.put<void>(`chat/room/${roomId}/lastSeenAt`);
    }

}
