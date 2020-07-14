import React, { Component, Fragment } from "react"
import { Select, Form, Divider, Button } from 'antd';
import { EventsApi } from "../../../helpers/request"

const { Option, OptGroup } = Select;

class RelationshipFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [],
            state: "disabled"
        }
        this.submit = this.submit.bind(this)
    }

    componentDidMount() {
        const { fields } = this.props
        this.setState({ fields })
    }

    handleChange(e) {
        let name = e.target.name
        let value = e.target.value
        this.setState({ [name]: value })
    }

    async submit() {
        const { eventId } = this.props
        const Fields_conditions = {
            field: this.state.field,
            fieldToValidate: this.state.fieldToValidate,
            state: this.state.state === "disabled" ? "disabled" : "enabled",
            value: this.state.value
        }

        const properties = {
            Fields_conditions
        }
        const save = await EventsApi.editOne(properties, eventId)
        console.log(save)
    }
    render() {
        const { fields } = this.props
        return (
            <Form layout="inline">
                <>
                    <div>
                        <label>El campo: </label>
                        <div className="select">
                            <select defaultValue="" name="field" onChange={(e) => this.handleChange(e)}>
                                <option value="">Seleccione...</option>
                                {fields.map((field, key) => {
                                    return <option key={key} value={field.label}>{field.label}</option>
                                })}

                            </select>
                        </div>
                    </div>
                    <Divider type="vertical" />
                    <div>
                        <label>Estará: </label>
                        <div className="select">
                            <select defaultValue="disabled" name="state" onChange={(e) => this.handleChange(e)}>
                                <option value="enabled">Habilitado</option>
                                <option value="disabled">Inhabilitado</option>
                            </select>
                        </div>
                    </div>
                    <Divider type="vertical" />
                    <label>Cuando el campo: </label>
                    {

                        fields.map((item, key) => {
                            return <div key={key}>
                                {item.type === "multiplelist" && (
                                    <>
                                        <div className="select">
                                            <select defaultValue="" name="fieldToValidate" onChange={(e) => this.handleChange(e)}>
                                                <option value="">Seleccione...</option>
                                                <option key={key} value={item.label}>{item.label}</option>
                                            </select>
                                        </div>
                                        <Divider type="vertical" />
                                        <label>Tenga el valor de: </label>
                                        <div className="select">
                                            <select defaultValue="" name="value" onChange={(e) => this.handleChange(e)}>
                                                <option value="">Seleccione...</option>
                                                {item.options.map((item, key) => (
                                                    <option key={key} value={item.value}>{item.label}</option>
                                                ))}

                                            </select>
                                        </div>

                                    </>
                                )}
                            </div>
                        })
                    }
                    <Button onClick={this.submit} style={{ marginTop: "3%" }}>Guardar</Button>
                </>
            </Form>
        );
    };

}

export default RelationshipFields