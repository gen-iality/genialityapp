import React from "react";
import Moment from "moment";
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import { EnvironmentOutlined, LaptopOutlined } from "@ant-design/icons";



const BgElement = Element.BgElement;

function capitalize(val) {
    val = Moment(val).format("MMMM YYYY")
    return val.toLowerCase()
        .trim()
        .split(' ')
        .map(v => v[0].toUpperCase() + v.substr(1))
        .join(' ');
}

let bannerEvent = ({ bgImage, title, organizado, place, dateStart, dateEnd, bgImageText, type_event }) => {

    return (
        <BannerAnim prefixCls="banner-user">
            <Element
                prefixCls="banner-user-elem"
                key="0"
            >
                <BgElement
                    key="bg"
                    className="bg"
                    style={{
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <div className="banner-user-text-container"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',

                    }}>
                    <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>

                        {/* Fecha del evento */}
                        <div>
                            {
                                dateStart === dateEnd ?
                                    <span>{Moment(dateEnd).format("DD")}{" de "} {capitalize(dateEnd)}</span>
                                    :
                                    <div>
                                        <span>Del {Moment(dateStart).format("DD")}</span>
                                        <span> al {Moment(dateEnd).format("DD")}{" "} {capitalize(dateEnd)}</span>
                                    </div>
                            }

                        </div>

                        {/* Nombre del evento */}
                        <span>{title}</span>

                    </TweenOne>

                    <TweenOne className="banner-user-text"
                        animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
                    >

                        {/* Quien lo organiza */}
                        <div>
                            <span>Organizado por: {organizado}</span>
                        </div>

                        {/* Lugar del evento */}
                        <div>
                            {
                                console.log(type_event),
                                type_event === "onlineEvent" ?
                                    <div>
                                        <span><LaptopOutlined style={{ marginRight: "2%" }} />Era virtual</span>
                                    </div>
                                    :
                                    <span><EnvironmentOutlined /> {place}</span>
                            }

                        </div>
                    </TweenOne>

                </div>

                {/* Imagen opcional para el logo o marca del evento  */}
                {/* <div className="container-logoBanner">
                    <img src="https://storage.googleapis.com/herba-images/evius/events/97XuEjJwHIkAyoAO1PreHOMUKMgFfM6MRmyEB5PS.jpeg" alt="" />
                </div> */}
            </Element>

        </BannerAnim>
    );

}

export default bannerEvent