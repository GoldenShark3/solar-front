import {
    IStationState,
    SET_ERROR,
    SET_IS_LOADING,
    SET_STATIONS,
    StationsWithPlanetsDropdownPayload, TStationAction,
    TStationState
} from "./stationTypes";
import {StationDto} from "../../model/station/StationDto";
import {ActionType, IPlainDataAction} from "../redux-types";
import {StationForTable} from "../../model/station/StationForTable";
import {Page} from "../../model/util/Page";

const initialState: TStationState = {
    stations: new Array<StationForTable>(),
    planetsDropdown: new Map<number, string>(),
    totalItems: 0,
    itemsPerPage: 3,
    currentPage: 0,
    isError: false,
    isLoading: false

}


export function stationsReducer (state: TStationState = initialState, action: TStationAction) {
    let castedAction;
    switch (action.type) {
        case SET_IS_LOADING:
            castedAction = action as IPlainDataAction<boolean>;
            return {...state, isLoading: castedAction.payload, isError: false}
        case SET_ERROR:
            return {...state, isError: true, isLoading: false}
        case SET_STATIONS:
            castedAction = action as IPlainDataAction<Page<StationForTable>>
            console.log(castedAction.payload);
            return {...state,
                stations: castedAction.payload.content,
                isLoading: false,
                itemsPerPage: castedAction.payload.size,
                currentPage: castedAction.payload.number,
                totalItems: castedAction.payload.totalElements
            }
        default: return state;
    }
}