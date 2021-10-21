import React, { useState, useEffect, useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import {
    ArrowLeftOutlined,
    CaretRightOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import Moment from "moment-timezone";
import ReactPlayer from "react-player";
import { useIntl } from "react-intl";
import {
    Row,
    Col,
    Button,
    List,
    Avatar,
    Card,
    Tabs,
    Badge,
    Typography,
    Form,
    Input,
    Alert,
} from "antd";
import WithEviusContext from "../../../Context/withContext";
import { setTopBanner } from "../../../redux/topBanner/actions";
import { Activity, AgendaApi } from "../../../helpers/request";
import { setVirtualConference } from '../../../redux/virtualconference/actions';
import HelperContext from "../../../Context/HelperContext";
import { UseSurveysContext } from "../../../Context/surveysContext";
import { isMobile } from 'react-device-detect';
import { firestore } from "../../../helpers/firebase";
import * as SurveyActions from "../../../redux/survey/actions";
import { CheckinActiviy } from "./utils";
import SurveyDrawer from "../surveys/components/surveyDrawer";
import HeaderColumnswithContext, { HeaderColumns } from "./HeaderColumns";
const {
    setCurrentSurvey,
    setSurveyVisible,
    setHasOpenSurveys,
    unsetCurrentSurvey,
} = SurveyActions;

const AgendaActividadDetalle = (props) => {

    let { chatAttendeChats, HandleOpenCloseMenuRigth, isCollapsedMenuRigth, currentActivity, handleChangeCurrentActivity } = useContext(HelperContext);
    let [ orderedHost, setOrderedHost ] = useState([]);
    let cSurveys = UseSurveysContext();
    const [ videoStyles, setVideoStyles ] = useState(null);
    const [ videoButtonStyles, setVideoButtonStyles ] = useState(null);
    let [ idSpeaker, setIdSpeaker ] = useState(false);
    const [ userActivity, setuserActivity ] = useState({})
    const imagePlaceHolder =
        "https://via.placeholder.com/1500x540/" +
        props.cEvent.value.styles.toolbarDefaultBg.replace("#", "") +
        "/" +
        props.cEvent.value.styles.textMenu.replace("#", "") +
        "?text=" +
        props.cEvent.value.name;



    const intl = useIntl();
    {
        Moment.locale(window.navigator.language);
    }


    async function listeningStateMeetingRoom(event_id, activity_id) {
        firestore
            .collection("events")
            .doc(event_id)
            .collection("activities")
            .doc(activity_id)
            .onSnapshot((infoActivity) => {
                if (!infoActivity.exists) return;
                const data = infoActivity.data();
                const { habilitar_ingreso, meeting_id, platform, tabs } = data;
                let currentemp = currentActivity;
                currentemp.meeting_id = meeting_id;
                currentemp.platform = platform;
                currentemp.habilitar_ingreso = habilitar_ingreso;
                currentemp.tabs = tabs;
                console.log("currentemp", currentemp)
                handleChangeCurrentActivity(currentemp);
            });
    }

    async function getSpeakers(idSpeaker) {
        setIdSpeaker(idSpeaker);
    }


    useEffect(() => {

        CheckinActiviy(props.cEvent.value._id, props.match.params.activity_id, props.cEventUser, props.cUser);
        console.log("props", props)

        async function getActividad() {
            return await AgendaApi.getOne(props.match.params.activity_id, props.cEvent.value._id);
        }

        function orderHost(hosts) {
            hosts.sort(function (a, b) {
                return a.order - b.order;
            });
            setOrderedHost(hosts);
        }

        getActividad().then((result) => {
            handleChangeCurrentActivity(result);
            orderHost(result.hosts);
            cSurveys.set_current_activity(result);
        });

        props.setTopBanner(false);
        props.setVirtualConference(false);
        HandleOpenCloseMenuRigth(false);
        return () => {
            props.setTopBanner(true);
            props.setVirtualConference(true);
            HandleOpenCloseMenuRigth(!isCollapsedMenuRigth);
        };
    }, []);


    useEffect(() => {
        async function GetStateMeetingRoom() {
            await listeningStateMeetingRoom(props.cEvent.value._id, currentActivity._id);
        }

        if (currentActivity) {
            GetStateMeetingRoom();
            cSurveys.set_current_activity(currentActivity);
        }
    }, [ currentActivity ]);



    useEffect(() => {
        if (
            chatAttendeChats === "4"
        ) {
            const sharedProperties = {
                position: "fixed",
                right: "0",
                width: "170px",
            };

            const verticalVideo = isMobile ? { top: "5%" } : { bottom: "0" };

            setVideoStyles({
                ...sharedProperties,
                ...verticalVideo,
                zIndex: "100",
                transition: "300ms",
            });

            const verticalVideoButton = isMobile ? { top: "9%" } : { bottom: "27px" };

            setVideoButtonStyles({
                ...sharedProperties,
                ...verticalVideoButton,
                zIndex: "101",
                cursor: "pointer",
                display: "block",
                height: "96px",
            });
        } else {
            setVideoStyles({ width: "100%", height: "80vh", transition: "300ms" });
            setVideoButtonStyles({ display: "none" });
        }
    }, [ chatAttendeChats, isMobile ]);

    const handleSignInForm = (values) => {
        setuserActivity({ names: values.names, email: values.email })
    };


    return (
        <div className="is-centered">
            <div className=" container_agenda-information container-calendar2 is-three-fifths">

                <Card
                    style={{ padding: "1 !important" }}
                    className="agenda_information"
                >
                    <HeaderColumnswithContext isVisible={true} />
                </Card>

            </div>
            {/* Drawer encuestas */}
            <SurveyDrawer colorFondo={props.cEvent.value.styles.toolbarDefaultBg} colorTexto={props.cEvent.value.styles.textMenu} />
        </div>

    )
}



const mapStateToProps = (state) => ({
    mainStageContent: state.stage.data.mainStage,
    userInfo: state.user.data,
    currentActivity: state.stage.data.currentActivity,
    currentSurvey: state.survey.data.currentSurvey,
    hasOpenSurveys: state.survey.data.hasOpenSurveys,
    tabs: state.stage.data.tabs,
    generalTabs: state.tabs.generalTabs,
    permissions: state.permissions,
    isVisible: state.survey.data.surveyVisible,
    viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
});

const mapDispatchToProps = {
    setTopBanner,
    setVirtualConference,
    setHasOpenSurveys
};

let AgendaActividadDetalleWithContext = WithEviusContext(AgendaActividadDetalle);
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(AgendaActividadDetalleWithContext));
