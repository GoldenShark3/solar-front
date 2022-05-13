import {StationDto} from "../model/station/StationDto";
import {axiosApi} from "../http/axios";
import {Page} from "../model/Page";


export function fetchStations(page: number, size: number) {
    return axiosApi.get<Page<StationDto>>("station?" + "page=" + page + "&size=" + size);
}
