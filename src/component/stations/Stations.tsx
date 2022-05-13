import {AppState} from "../../index";
import React, {useEffect} from "react";
import Navbar from "../navbar/Navbar";
import {connect, ConnectedProps} from "react-redux";
import StationsTable from "./table/StationsTable";
import globalStyles from "../GlobalStyles.module.css";
import LoadProgress from "../circular-progress/LoadProgress";
import {findStationsActionCreator} from "../../redux/stations/stationActions";

const Stations: React.FC<Props> = (props) => {

    useEffect(() => {
        props.findStationsActionCreator(0, 10);
    }, [findStationsActionCreator])

    return (
        <div className={globalStyles.wrapper}>
            <Navbar/>
            <h1 className={globalStyles.page_title}>Stations</h1>
            <div>
                {props.isLoading ? <LoadProgress/> : <StationsTable/>}
            </div>
        </div>

    );
}

const mapStateToProps = (state: AppState) => ({
    isLoading: state.stations.isLoading,
    isError: state.stations.isError,
    stations: state.stations.stations,

})

const mapDispatchToProps = {
    findStationsActionCreator
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(Stations);