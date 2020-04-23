import React from "react";
import Moment from "moment";
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import { EnvironmentOutlined } from "@ant-design/icons";



const BgElement = Element.BgElement;


let bannerEvent = ({ bgImage, title, organizado, place, dateStart, dateEnd }) => {

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
                <div className="banner-user-text-container">
                    <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>

                        {/* Fecha del evento */}
                        <div>
                            <span>Del {Moment(dateStart).format("DD")}</span>
                            <span> al {Moment(dateEnd).format("DD")}{" "} {Moment(dateEnd).format("MMM YY")}</span>
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

                            <span><EnvironmentOutlined /> {place}</span>
                        </div>
                    </TweenOne>
                </div>
            </Element>


        </BannerAnim>
    );

}

export default bannerEvent