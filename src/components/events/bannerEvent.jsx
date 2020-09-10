import React from "react";
import Moment from "moment";
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import { EnvironmentOutlined, LaptopOutlined } from "@ant-design/icons";



const BgElement = Element.BgElement;

function capitalize(val) {
    val = Moment(val).format("DD MMMM YYYY")
    return val.toLowerCase()
        .trim()
        .split(' ')
        .map(v => v[0].toUpperCase() + v.substr(1))
        .join(' ');
}

function capitalizeMont(val) {
    val = Moment(val).format("MMMM YYYY")
    return val.toLowerCase()
        .trim()
        .split(' ')
        .map(v => v[0].toUpperCase() + v.substr(1))
        .join(' ');
}



let bannerEvent = ({ bgImage, mobileBanner, title, organizado, place, dateStart, dateEnd, dates, bgImageText, type_event }) => {
  
    return (
        <BannerAnim prefixCls="banner-user" style={{overflow:"visible"}}>
            <Element
                prefixCls="banner-user-elem"
                key="0"
                style={{overflow:"visible"}}
            >
                <BgElement
                    key="bg"
                    className="bg"
                    style={(window.innerWidth <= 780) && mobileBanner !== undefined ? { backgroundImage: `url(${mobileBanner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    }:{ backgroundImage: `url(${bgImage})`,backgroundSize: 'cover',
                    backgroundPosition: 'center'}}                    
                />               
                <div className="banner-user-text-container"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',

                    }}>
                    <TweenOne className="banner-user-text">

                        {/* Fecha del evento */}
                        <div>
                            {
                                dates ?
                                    <>
                                        {
                                            dates.map((item, key) => (
                                                <span key={key}>
                                                    {Moment(item).format("DD MMMM") + ((dates.length - 1 > key) ? ", " : "")}
                                                </span>
                                            ))
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            dateStart === dateEnd ?
                                                <span>{Moment(dateStart).format("DD")}{" de "} {(Moment(dateEnd).format("MMMM YYYY"))}</span>
                                                :
                                                <div>
                                                    {
                                                        (Moment(dateStart).format("MMMM") === Moment(dateEnd).format("MMMM")) ? (
                                                            <>
                                                                <span>Del {Moment(dateStart).format("DD")}</span>
                                                                <span> al {Moment(dateEnd).format("DD")}{" de "} {(Moment(dateEnd).format("MMMM YYYY"))}</span>
                                                            </>
                                                        ) : (
                                                                <>
                                                                    <span>Del {Moment(dateStart).format("DD")}{" de"} {(Moment(dateStart).format("MMMM"))}</span>
                                                                    <span> al {Moment(dateEnd).format("DD")}{" de "} {(Moment(dateEnd).format("MMMM YYYY"))}</span>
                                                                </>
                                                            )
                                                    }
                                                </div>
                                        }
                                    </>

                            }
                        </div>
                    </TweenOne>



                    <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
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
                                
                                type_event === "onlineEvent" ?
                                    <div>
                                        <span><LaptopOutlined style={{ marginRight: "2%" }} />Virtual</span>
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