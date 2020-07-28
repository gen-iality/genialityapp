import React, { useState, useEffect, Fragment } from "react";
import { withRouter, Link } from "react-router-dom";
import { Card, PageHeader, Button } from 'antd';

let DescriptionCompany = (props) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.data) {
            setData(props.data)
        }
    }, [data])


    const { gotoActivityList } = props
    return (
        <Fragment>
            <PageHeader
                className="site-page-header"
                onBack={(e) => {
                    gotoActivityList();
                }}
                title={data.name}
            />
            <Card type="inner" title={data.name}>
                <div dangerouslySetInnerHTML={{ __html: data.description }} />
                <p>Tipo de stand: </p>
                <p>{data.stand_type}</p>
                <p>Horario</p>
                <div dangerouslySetInnerHTML={{ __html: data.times_and_venues }} />
                <a href={data.facebook}>Link a facebook</a>
                <br />
                <a href={data.instagram}>Link a instagram</a>
                <br />
                <a href={data.linkedin}>Link a linkedin</a>
                <br />
                <a href={data.twitter}>Link a twitter</a>
                <br />
                <a href={data.webpage}>{data.name}</a>
            </Card>
        </Fragment>
    )
}

export default withRouter(DescriptionCompany)