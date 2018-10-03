import React, {Component} from 'react';
import Moment from "moment"
import ImageInput from "../shared/imageInput";
import {Actions, EventsApi} from "../../helpers/request";
import 'react-widgets/lib/scss/react-widgets.scss'
import FormEvent from "../shared/formEvent";
import {BaseUrl} from "../../helpers/constants";
Moment.locale('es');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : this.props.event,
            selectedOption: [],
            valid: true
        };
        this.submit = this.submit.bind(this);
    }

    async componentDidMount(){
        const resp = await Actions.getAll('api/category');
        const categories = handleData(resp.data);
        const category_ids = this.state.event.category_ids;
        let selectedOption = [];
        if(category_ids){
            categories.map(item=>{
                let pos = category_ids.indexOf(item.value);
                if(pos>=0){selectedOption.push(item)}
            });
        }
        this.setState({categories,selectedOption})
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({event:{...this.state.event,[name]:value}},this.valid)
    };

    valid = () => {
        const {event} = this.state,
            valid = (event.name.length>8 && event.description.length>5 && event.location.PlaceId);
        this.setState({valid:!valid})
    };

    handleSelect = (selectedOption) => {
        this.setState({ selectedOption });
    };

    changeDate=(value,name)=>{
        this.setState({event:{...this.state.event,[name]:value}})
    };

    changeImg = (files) => {
        const file = files[0];
        if(file){
            this.setState({imageFile: file,
                event:{...this.state.event, picture: null}});
            let data = new FormData();
            const url = '/api/files/upload',
                self = this;
            data.append('file',this.state.imageFile);
            Actions.post(url, data)
                .then((image) => {
                    self.setState({
                        event: {
                            ...self.state.event,
                            picture: image
                        },fileMsg:'Image uploaded successfull'
                    });
                });
        }
        else{
            this.setState({errImg:'Only images files allowed. Please try again (:'});
        }
    };

    async submit(e) {
        this.setState({loading:true});
        e.preventDefault();
        e.stopPropagation();
        const { event } = this.state;
        const hour_start = Moment(event.hour_start).format('HH:mm');
        const date_start = Moment(event.date_start).format('YYYY-MM-DD');
        const hour_end = Moment(event.hour_end).format('HH:mm');
        const date_end = Moment(event.date_end).format('YYYY-MM-DD');
        const datetime_from = Moment(date_start+' '+hour_start, 'YYYY-MM-DD HH:mm');
        const datetime_to = Moment(date_end+' '+hour_end, 'YYYY-MM-DD HH:mm');
        const categories = this.state.selectedOption.map(item=>{
            return item.value
        })
        const data = {
            name: event.name,
            datetime_from : datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to : datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: event.picture,
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: event.description,
            category_ids: categories
        };
        try {
            if(event._id){
                const result = await EventsApi.editOne(data, event._id);
                console.log(result);
                this.setState({loading:false});
            }
            else{
                const result = await Actions.create('/api/user/events', data);
                console.log(result);
                this.setState({loading:false});
                if(result._id){
                    window.location.replace(`${BaseUrl}/event/${result._id}`);
                }else{
                    this.setState({msg:'Cant Create',create:false})
                }
            }
        } catch (e) {
            console.log('Some error')
            console.log(e)
        }
    }

    onSuggestSelect = (suggest) => {
        if(suggest){
            const place = suggest.gmaps;
            const location = place.geometry && place.geometry.location ? {
                Latitude: place.geometry.location.lat(),
                Longitude: place.geometry.location.lng()
            } : {};
            const componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name'
            };
            const mapping = {
                street_number: 'number',
                route: 'street',
                locality: 'city',
                administrative_area_level_1: 'state'
            };
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    const val = place.address_components[i][componentForm[addressType]];
                    location[mapping[addressType]] = val;
                }
            }
            location.FormattedAddress = place.formatted_address;
            location.PlaceId = place.place_id;
            this.setState({event:{...this.state.event,location}},this.valid)
        }
    };

    render() {
        const { event, categories, selectedOption, valid } = this.state;
        return (
            <form onSubmit={this.submit}>
                <FormEvent event={event} categories={categories} selectedOption={selectedOption}
                           imgComp={
                               <div className="field">
                                   <label className="label">Foto</label>
                                   <div className="control">
                                       <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                                   changeImg={this.changeImg} errImg={this.state.errImg}/>
                                   </div>
                                   {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                               </div>
                           }
                           handleChange={this.handleChange} handleSelect={this.handleSelect}
                           changeDate={this.changeDate} onSuggestSelect={this.onSuggestSelect}/>
                <div className="field">
                    <div className="control">
                        {
                            this.state.loading? <p>Saving...</p>
                            :<button type={"submit"} className={`button is-outlined is-success`} disabled={valid}>Save!</button>
                        }
                    </div>
                </div>
            </form>
        );
    }
}

const handleData = (data) => {
    let list = [];
    data.map(item=>{
        return list.push({value:item._id,label:item.name})
    })
    return list;
};

export default General;