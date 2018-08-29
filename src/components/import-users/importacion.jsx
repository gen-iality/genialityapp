import React, {Component} from 'react';
import XLSX from "xlsx";
import Dropzone from 'react-dropzone';
import {Template} from "../../helpers/constants";

class Importacion extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            const dimension = sheetObj["!ref"].split(":");
            let inicio = dimension[0].substring(0, 1);
            let fin = dimension[1].substring(0, 1);
            let finN = parseInt(dimension[1].substring(1),10);
            inicio = abc.indexOf(inicio);
            fin = abc.indexOf(fin);
            let fields = [];
            for(let i = inicio; i < fin + 1; i++){
                let key = sheetObj[abc[i]+1].w.trim();
                fields[i] = {key:key,list:[],used:false};
                for(let j = 2; j < finN + 1; j++){
                    if(sheetObj[abc[i] + j] &&
                        sheetObj[abc[i] + j].w &&
                        sheetObj[abc[i] + j].w.trim().length > 0) {
                        fields[i].list.push(sheetObj[abc[i] + j].w.trim())
                    }else{
                        fields[i].list.push('')
                    }
                }
                fields[i].list.slice(0,finN-1);
            }
            self.props.handleXls(fields)
        };
        reader.readAsBinaryString(f);
    }

    downloadExcel = () => {
        let a = document.createElement('A');
        a.href = Template;
        a.download = 'usertemplate.xls'; //userstemplate+nombreevento+ddmmyy
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    render() {
        return (
            <React.Fragment>
                <p>Para importar los usuarios de tu evento debes cargar un archivo excel con las columnas organizadas (cómo se muestra en el siguiente ejemplo) o para mayor facilidad <strong>descarga nuestro template</strong>.</p>
                <p>Las columnas requeridas que deben existir para importar usuarios son: <strong>nombre</strong> y <strong>correo</strong></p>
                <Dropzone onDrop={this.handleXlsFile} accept=".xls,.xlsx" className="zone">
                    <button className="button is-rounded is-primary">Importar Excel</button>
                </Dropzone>
                <button className="button is-text" onClick={this.downloadExcel}>
                    <span className="icon"><i className="fas fa-cloud-download-alt" aria-hidden="true"/></span>
                    <span><ins>Descargar Template</ins></span>
                </button>
            </React.Fragment>
        );
    }
}

export default Importacion;