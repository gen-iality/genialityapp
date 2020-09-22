import React, {Component} from 'react';

class TicketConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price:'',
            total: 0
        }
    }

    onChange = (e) => {
        const {name,value} = e.target;
        const total = Math.ceil(value - (value*3.5/100));
        this.setState({[name]:value,total})
    }

    render() {
        const {price,total} = this.state;
        return (
            <div style={{padding: "3rem 9.5rem"}}>
                <div className="content">
                    <h3>Informativa</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse dui enim, finibus at tincidunt eget, efficitur sed turpis. Proin non arcu vitae nisl sollicitudin condimentum. Fusce tincidunt magna quis eros hendrerit vulputate. Vestibulum gravida dictum est sit amet pharetra. Aenean aliquam nunc leo, non suscipit dolor facilisis in. Vestibulum rutrum aliquet scelerisque. Aenean non ex id augue efficitur egestas quis quis ante. Sed vel varius mauris. Maecenas in lobortis enim. Cras luctus dolor tellus, eget varius diam egestas at. Pellentesque massa felis, porttitor sed sem molestie, porta convallis mauris. Donec quis massa eros. Quisque sed ultricies velit. Maecenas ullamcorper condimentum interdum. Pellentesque consequat ex eu est ultricies, vel varius mauris tincidunt. Maecenas in leo arcu.

                        Cras vel sem id tortor pharetra molestie. Curabitur hendrerit dolor in fringilla lacinia. Donec condimentum mi et varius commodo. In porta blandit mollis. Nullam quis lacus dolor. Nunc lectus sapien, bibendum et nisi id, venenatis fermentum dolor. Curabitur fermentum eu nulla sed ornare.

                        Donec dignissim felis arcu. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus suscipit lacus in suscipit imperdiet. Suspendisse potenti. Mauris bibendum sodales augue in ornare. Aliquam sed varius elit, sed tempor tortor. Phasellus mi felis, tristique in nulla vel, mollis imperdiet ipsum. Nam nec erat augue. Morbi tempor, eros nec laoreet mattis, tortor augue auctor orci, a porttitor ligula dolor sed leo. Mauris ut vestibulum odio. Nulla facilisi. Curabitur venenatis, diam vel euismod mattis, leo lectus luctus massa, sed commodo purus ante quis lorem. Vestibulum interdum dui eget nisl luctus vulputate. Aliquam erat volutpat. Aliquam et quam eget augue facilisis sagittis nec ac dolor. In pretium metus sagittis elit ultrices, ut varius ligula iaculis.

                        In iaculis orci nec nunc hendrerit, tristique facilisis lectus consequat. Sed eleifend tincidunt erat quis finibus. Phasellus consectetur hendrerit risus, sit amet ultricies mi euismod eu. Nulla ac dolor eu felis suscipit egestas. Praesent eu nisi leo. Cras et efficitur leo. Nulla interdum vel ipsum rhoncus tristique. Donec quis bibendum ante. Ut sed sapien ultricies, elementum purus in, posuere est. Sed commodo accumsan venenatis. Phasellus ullamcorper dolor id ante molestie, non lobortis risus maximus. Praesent quis dui dolor. Vestibulum id mauris vitae purus rhoncus aliquam. Nunc sed aliquam risus.
                    </p>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-half columns">
                        <div className="column columns is-5">
                            <div className="field column is-10">
                                <label className="label has-text-grey-light">Precio de tu Boleta (COP)</label>
                                <div className="control">
                                    <input className="input" name={'price'} type="text" placeholder="0.0" value={price} onChange={this.onChange}/>
                                </div>
                            </div>
                            <div className="column">-</div>
                        </div>
                        <div className="column columns">
                            <div className="field column">
                                <label className="label has-text-grey-light">Comisión</label>
                                <div className="control">
                                    <input className="input" type="text" value={"3.5%"} readOnly={true}/>
                                </div>
                            </div>
                            <div className="column">=</div>
                        </div>
                        <div className="column is-5">
                            <div className="field">
                                <label className="label has-text-grey-light">Recaudo total por boleta (COP)</label>
                                <div className="control">
                                    <input className="input" type="text" value={total} readOnly={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TicketConfig;