import React, {Component} from "react";

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[]
        }
    }

    componentDidMount() {
        //fetch report
    }

    render() {
        return (
            <section>
                <div className="checkin-tags-wrapper menu-g">
                    <div className="columns is-mobile is-multiline checkin-tags">
                        <div className="column is-narrow">
                            <div className="tags is-centered">
                                <span className="tag is-primary">2</span>
                                <span className="tag is-white">Generados</span>
                            </div>
                        </div>
                        <div className="column is-narrow">
                            <div className="tags is-centered">
                                <span className="tag is-danger">2</span>
                                <span className="tag is-white">No Generados</span>
                            </div>
                        </div>
                        <div className="column is-narrow">
                            <div className="tags is-centered">
                                <span className="tag is-light">4</span>
                                <span className="tag is-white">Total</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Certificado</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.list.map((item,key)=>{
                            return <tr key={key}>
                                <td>{item.name}</td>
                                <td>{item.mail}</td>
                                <td>{item.cert}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }
}

export default Reports
