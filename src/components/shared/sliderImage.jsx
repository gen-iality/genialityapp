import React from 'react';
import Carousel from "react-slick/lib/index";

function NextArrow(props) {
    const {  onClick} = props;
    return (
        <div className='arrows' onClick={onClick}>
            <span className='arrow right'><svg viewBox="0 0 477.175 477.175"><path d="M360.731,229.075l-225.1-225.1c-5.3-5.3-13.8-5.3-19.1,0s-5.3,13.8,0,19.1l215.5,215.5l-215.5,215.5 c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-4l225.1-225.1C365.931,242.875,365.931,234.275,360.731,229.075z"></path></svg></span>
        </div>
    );
}

function PrevArrow(props) {
    const { onClick} = props;
    return (
        <div className='arrows' onClick={onClick}>
            <span className='arrow left'><svg viewBox="0 0 477.175 477.175"><path d="M145.188,238.575l215.5-215.5c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-225.1,225.1c-5.3,5.3-5.3,13.8,0,19.1l225.1,225 c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4c5.3-5.3,5.3-13.8,0-19.1L145.188,238.575z"></path></svg></span>
        </div>
    );
}

export default function Slider(props){
    const settings = {
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 4500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
    };
    return(
        <Carousel {...settings}>
            {
                props.images.map((image,key)=>{
                    return <div key={key}>
                        <figure >
                            <img src={image} alt="Evius.co"/>
                        </figure>
                    </div>
                })
            }
        </Carousel>
    );
}