/*global google*/
import React, {Component} from 'react';
import Geosuggest from 'react-geosuggest'
import { DateTimePicker } from 'react-widgets'
import SelectInput from "./selectInput";

class FormEvent extends Component {
    render() {
        const { event, categories, organizers, types, imgComp, selectedCategories, selectedOrganizer, selectedType } = this.props;
        return (
            <div className="columns">
                <div className="column">
                    <div className="field">
                        <label className="label required has-text-grey-light">Nombre</label>
                        <div className="control">
                            <input className="input" name={"name"} type="text"
                                   placeholder="Text input" value={event.name}
                                   onChange={this.props.handleChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label className="label required has-text-grey-light">Dirección</label>
                        <div className="control">
                            <Geosuggest
                                placeholder={'Dirección'}
                                onSuggestSelect={this.props.onSuggestSelect}
                                initialValue={event.location.FormattedAddress}
                                location={new google.maps.LatLng(event.location.Latitude,event.location.Longitude)}
                                radius="20"/>
                        </div>
                    </div>
                    <div className="field">
                        <div className="columns">
                            <div className="column inner-column">
                                <div className="field">
                                    <label className="label required has-text-grey-light">Fecha Inicio</label>
                                    <div className="control">
                                        <DateTimePicker
                                            value={event.date_start}
                                            format={'L'}
                                            time={false}
                                            onChange={value => this.props.changeDate(value,"date_start")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="vertical-line"></div>
                            <div className="column  inner-column">
                                <div className="field">
                                    <label className="label required has-text-grey-light">Hora Inicio</label>
                                    <div className="control">
                                        <DateTimePicker
                                            value={event.hour_start}
                                            step={60}
                                            date={false}
                                            onChange={value => this.props.changeDate(value,"hour_start")}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <div className="columns">
                            <div className="column inner-column">
                                <div className="field">
                                    <label className="label required has-text-grey-light">Fecha Fin</label>
                                    <div className="control">
                                        <DateTimePicker
                                            value={event.date_end}
                                            format={'L'}
                                            time={false}
                                            onChange={value => this.props.changeDate(value,"date_end")}/>
                                    </div>
                                </div>
                            </div>
                            <div className="vertical-line"></div>
                            <div className="column inner-column">
                                <div className="field">
                                    <label className="label required has-text-grey-light">Hora Fin</label>
                                    <div className="control">
                                        <DateTimePicker
                                            value={event.hour_end}
                                            step={60}
                                            date={false}
                                            onChange={value => this.props.changeDate(value,"hour_end")}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label required has-text-grey-light">Descripción</label>
                        <div className="control">
                            <textarea className="textarea" name={"description"} placeholder="Textarea" value={event.description} onChange={this.props.handleChange}/>
                        </div>
                    </div>
                </div>
                <div className="column">
                    {imgComp}
                    <div className="field">
                        <div className="control">
                            <div className="select">
                                <select value={event.visibility} onChange={this.props.handleChange} name={'visibility'}>
                                    <option value={'PUBLIC'}>Crear un evento público</option>
                                    <option value={'ORGANIZATION'}>Crear un evento privado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <SelectInput name={'Organizado por:'} isMulti={false} selectedOptions={selectedOrganizer} selectOption={this.props.selectOrganizer} options={organizers} required={true}/>
                    <SelectInput name={'Tipo'} isMulti={false} selectedOptions={selectedType} selectOption={this.props.selectType} options={types} required={true}/>
                    <SelectInput name={'Categorías:'} isMulti={true} selectedOptions={selectedCategories} selectOption={this.props.selectCategory} options={categories} required={true}/>
                </div>
            </div>
        );
    }
}

export default FormEvent;