import React, {Component} from 'react';
import XLSX from "xlsx";
import Moment from "moment"
import momentLocalizer from 'react-widgets-moment';
import Dropzone from 'react-dropzone';
Moment.locale('es');
momentLocalizer();

class Importacion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMsg:false
        };
        this.handleXlsFile = this.handleXlsFile.bind(this) // properly bound once
    }

    handleXlsFile(files) {
        let abc = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
        const f = files[0];
        const reader = new FileReader();
        const self = this;
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheetObj = workbook.Sheets[sheetName];
            if(sheetObj["!ref"]) {
                const dimension = sheetObj["!ref"].split(":");
                let inicio = dimension[0].substring(0, 1);
                let fin = dimension[1].substring(0, 1);
                let finN = parseInt(dimension[1].substring(1), 10);
                inicio = abc.indexOf(inicio);
                fin = abc.indexOf(fin);
                let fields = [];
                for (let i = inicio; i < fin + 1; i++) {
                    if(!sheetObj[abc[i] + 1] || !sheetObj[abc[i] + 1].w){
                        this.setState({errMsg:'Excel sin formato adecuado'});
                        break;
                    }
                    let key = sheetObj[abc[i] + 1].w.trim();
                    fields[i] = {key: key, list: [], used: false};
                    for (let j = 2; j < finN + 1; j++) {
                        if (sheetObj[abc[i] + j] &&
                            sheetObj[abc[i] + j].w &&
                            sheetObj[abc[i] + j].w.trim().length >= 0) {
                            fields[i].list.push(sheetObj[abc[i] + j].w.trim())
                        }else{
                            fields[i].list.push(undefined)
                        }
                    }
                    fields[i].list.slice(0, finN - 1);
                }
                self.props.handleXls(fields)
            }else{
                this.setState({errMsg:'Excel en blanco'})
            }
        };
        reader.readAsBinaryString(f);
    }

    downloadExcel = () => {
        let data = [{}];
        this.props.extraFields.map((extra)=>{
           return data[0][extra.name] = ''
        });
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, `attendeestemplate${Moment().format('DDMMYY')}.xls`);
    };

    componentWillReceiveProps(nextProps) {
        if (!nextProps.extraFields.length <= 0) {
            this.setState({showMsg:true})
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="importacion-txt">
                    <p>Para importar los usuarios de tu evento, debes cargar un archivo excel (.xls) con las columnas organizadas (como se muestra abajo). Para mayor facilidad, <strong>descarga nuestro template</strong> para organizar los datos de tus asistentes.</p>
                </div>

                <div className="importacion-ejm is-mobile is-gapless">
                    {
                        this.state.showMsg && (
                            <div className="columns is-mobile is-multiline">
                                <div className="column is-12 is-paddingless">
                                    <span className="is-uppercase has-text-weight-bold has-text-grey">Campos Requeridos</span>
                                </div>
                                <div className="column is-12 is-paddingless">
                                    <div className="ejm-tabla columns is-mobile is-gapless">
                                        {this.props.extraFields.map((extra,key)=>{
                                            return <div className="column" key={key}>
                                                <span className="has-text-grey-light">{extra.name}</span>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                <div className="importacion-btns has-text-centered">
                    <Dropzone onDrop={this.handleXlsFile} accept=".xls,.xlsx" className="zone">
                        <button className="button is-primary">Importar Excel</button>
                    </Dropzone>
                    <p className="help is-danger">{this.state.errMsg}</p>
                    <button className="button is-text" onClick={this.downloadExcel}>
                        <span className="icon"><i className="fas fa-cloud-download-alt" aria-hidden="true"/></span>
                        <span><ins>Descargar Template</ins></span>
                    </button>
                </div>
            </React.Fragment>
        );
    }
}

export default Importacion;