import { Button, Col, Row } from 'antd'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import HelperContext from '../../../Context/HelperContext';
import { useIntl } from "react-intl";
import { ArrowLeftOutlined, CaretRightOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import WithEviusContext from '../../../Context/withContext';
import EnVivo from "../../../EnVivo.svg";
import Moment from "moment-timezone";

const HeaderColumns = (props) => {


    let { currentActivity } = useContext(HelperContext);
    const intl = useIntl();


    return (
        <Row align="middle">
            <Col
                xs={{ order: 2, span: 8 }}
                sm={{ order: 2, span: 8 }}
                md={{ order: 1, span: 4 }}
                lg={{ order: 1, span: 4 }}
                xl={{ order: 1, span: 4 }}
                style={{ padding: "4px" }}
            >
                <Link to={`/landing/${props.cEvent.value._id}/agenda`}>
                    <Row style={{ paddingLeft: "10px" }}>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<ArrowLeftOutlined />}
                            size="small"
                        >
                            {intl.formatMessage({ id: "button.back.agenda" })}
                        </Button>
                    </Row>
                </Link>
            </Col>

            <Col
                xs={{ order: 2, span: 4 }}
                sm={{ order: 2, span: 4 }}
                md={{ order: 1, span: 2 }}
                lg={{ order: 1, span: 2 }}
                xl={{ order: 1, span: 2 }}
                style={{ padding: "4px" }}
            >
                <Row style={{ alignItems: "center", justifyContent: "center" }}>
                    <Col>
                        {currentActivity?.habilitar_ingreso === "open_meeting_room" ? (
                            <img
                                style={{ height: "4vh", width: "4vh" }}
                                src={EnVivo}
                                alt="React Logo"
                            />
                        ) : currentActivity?.habilitar_ingreso === "ended_meeting_room" &&
                            currentActivity !== null &&
                            currentActivity.video ? (
                            <CaretRightOutlined style={{ fontSize: "30px" }} />
                        ) : currentActivity?.habilitar_ingreso === "ended_meeting_room" &&
                            currentActivity !== null ? (
                            <CheckCircleOutlined style={{ fontSize: "30px" }} />
                        ) : currentActivity?.habilitar_ingreso === "" || currentActivity?.habilitar_ingreso == null ? (
                            <></>
                        ) : currentActivity?.habilitar_ingreso === "closed_meeting_room" ? (
                            <LoadingOutlined style={{ fontSize: "30px" }} />
                        ) : (
                            ""
                        )}
                    </Col>
                </Row>
                <Row
                    style={{
                        height: "2vh",
                        fontSize: 11,
                        fontWeight: "normal",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {currentActivity?.habilitar_ingreso === "open_meeting_room"
                        ? "En vivo"
                        : currentActivity?.habilitar_ingreso === "ended_meeting_room" &&
                            currentActivity !== null &&
                            currentActivity.video
                            ? "Grabado"
                            : currentActivity?.habilitar_ingreso === "ended_meeting_room" &&
                                currentActivity !== null
                                ? "Terminada"
                                : currentActivity?.habilitar_ingreso === "closed_meeting_room"
                                    ? "Por iniciar"
                                    : ""}
                </Row>
            </Col>



            <Col
                xs={{ order: 3, span: 20 }}
                sm={{ order: 3, span: 20 }}
                md={{ order: 2, span: 18 }}
                lg={{ order: 2, span: 16 }}
                xl={{ order: 2, span: 18 }}
                style={{ display: "flex" }}
            >
                <div style={{ padding: "8px" }}>
                    <Row style={{ textAlign: "left", fontWeight: "bolder" }}>
                        {currentActivity && currentActivity?.name}
                        {/* {configfast && configfast.enableCount && (
                            <>
                                ( &nbsp;
                                {configfast && configfast.totalAttendees
                                    ? configfast.totalAttendees
                                    : totalAttendees}
                                {"/"} {totalAttendeesCheckedin}{" "}
                                {"(" +
                                    Math.round(
                                        (totalAttendeesCheckedin /
                                            (configfast.totalAttendees
                                                ? configfast.totalAttendees
                                                : totalAttendees)) *
                                        100 *
                                        100
                                    ) /
                                    100 +
                                    "%)"}
                                )
                            </>
                        )} */}
                    </Row>
                    <Row
                        style={{
                            height: "2.5vh",
                            fontSize: 10,
                            fontWeight: "normal",
                        }}
                    >
                        <div
                            xs={{ order: 1, span: 24 }}
                            sm={{ order: 1, span: 24 }}
                            md={{ order: 1, span: 24 }}
                            lg={{ order: 3, span: 6 }}
                            xl={{ order: 3, span: 4 }}
                        >
                            {props.isVisible && (<div>
                                {Moment.tz(
                                    currentActivity !== null &&
                                    currentActivity?.datetime_start,
                                    "YYYY-MM-DD h:mm",
                                    "America/Bogota"
                                )
                                    .tz(Moment.tz.guess())
                                    .format("DD MMM YYYY")}{" "}
                                {Moment.tz(
                                    currentActivity !== null &&
                                    currentActivity?.datetime_start,
                                    "YYYY-MM-DD h:mm",
                                    "America/Bogota"
                                )
                                    .tz(Moment.tz.guess())
                                    .format("h:mm a z")}{" "}
                                -{" "}
                                {Moment.tz(
                                    currentActivity !== null &&
                                    currentActivity?.datetime_end,
                                    "YYYY-MM-DD h:mm",
                                    "America/Bogota"
                                )
                                    .tz(Moment.tz.guess())
                                    .format("h:mm a z")}
                            </div>)}

                        </div>

                        {currentActivity !== null &&
                            currentActivity?.space &&
                            currentActivity?.space?.name}
                    </Row>
                </div>
            </Col>
        </Row>
    )
}


let HeaderColumnswithContext = WithEviusContext(HeaderColumns);

export default HeaderColumnswithContext;