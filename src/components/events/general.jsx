import React, {Component} from 'react';
import Moment from "moment"
import ImageInput from "../shared/imageInput";
import {Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi} from "../../helpers/request";
import 'react-widgets/lib/scss/react-widgets.scss'
import FormEvent from "../shared/formEvent";
import {BaseUrl} from "../../helpers/constants";
import {TiArrowLoopOutline} from "react-icons/ti";
import LogOut from "../shared/logOut";
Moment.locale('es');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : this.props.event,
            selectedOption: [],
            selectedOrganizer: {},
            selectedType: {},
            valid: false
        };
        this.submit = this.submit.bind(this);
    }

    async componentDidMount(){
        try{
            const categories = await CategoriesApi.getAll();
            const types = await TypesApi.getAll();
            let organizers = await OrganizationApi.mine();
            const category_ids = this.state.event.category_ids;
            let selectedCategories = [];
            organizers.unshift({id:'me',name:''});
            organizers = organizers.map(item=>{
                return {value:item.id,label:item.name}
            });
            if(category_ids){
                categories.map(item=>{
                    let pos = category_ids.indexOf(item.value);
                    if(pos>=0){selectedCategories.push(item)}
                });
            }
            this.setState({categories,selectedCategories,organizers,types})
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true});
        }
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

    selectCategory = (selectedCategories) => {
        this.setState({ selectedCategories });
    };

    selectOrganizer = (selectedOrganizer) => {
        this.setState({ selectedOrganizer });
    };

    selectType = (selectedType) => {
        this.setState({ selectedType });
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
        const categories = this.state.selectedCategories.map(item=>{
            return item.value
        });
        const data = {
            name: event.name,
            datetime_from : datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to : datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: event.picture,
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: event.description,
            category_ids: categories,
            organizer_id: this.state.selectedOrganizer.value,
            event_type_id : this.state.selectedType.value
        };
        try {
            if(event._id){
                const result = await EventsApi.editOne(data, event._id);
                console.log(result);
                this.setState({loading:false});
            }
            else{
                const result = await Actions.create('/api/events', data);
                console.log(result);
                this.setState({loading:false});
                if(result._id){
                    window.location.replace(`${BaseUrl}/event/${result._id}`);
                }else{
                    this.setState({msg:'Cant Create',create:false})
                }
            }
        } catch (e) {
            console.log('Some error');
            console.log(e);
            this.setState({timeout:true});
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
        const { event, categories, organizers, types, selectedCategories, valid, timeout } = this.state;
        return (
            <form onSubmit={this.submit}>
                <FormEvent event={event} categories={categories} organizers={organizers} types={types}
                           selectedCategories={selectedCategories}
                           imgComp={
                               <div className="field">
                                   <label className="label">Foto</label>
                                   <div className="control">
                                       <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                                   divClass={'imgRsvp'} content={<img src={event.picture} alt={'Imagen Perfil'}/>}
                                                   classDrop={'dropzone'} contentDrop={<button className={`button is-link is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>}
                                                   contentZone={<div>Subir foto</div>}
                                                   changeImg={this.changeImg} errImg={this.state.errImg}/>
                                   </div>
                                   {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                               </div>
                           }
                           handleChange={this.handleChange}
                           selectCategory={this.selectCategory} selectOrganizer={this.selectOrganizer} selectType={this.selectType}
                           changeDate={this.changeDate} onSuggestSelect={this.onSuggestSelect}/>
                <div className="field">
                    <div className="control">
                        {
                            this.state.loading? <p>Saving...</p>
                            :<button type={"submit"} className={`button is-outlined is-success`} disabled={valid}>Save!</button>
                        }
                    </div>
                </div>
                {timeout&&(<LogOut/>)}
            </form>
        );
    }
}

export default General;