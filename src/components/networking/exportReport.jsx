import React, { Component } from "react"
import ReactExport from "react-data-export";
import { Button } from "antd"

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export default class ExportReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations: this.props.invitations
        }
    }

    render() {
        const { invitations } = this.state;
        return (
            <ExcelFile element={<Button>Exportar</Button>}>
                <ExcelSheet data={invitations} name="Employees">
                    <ExcelColumn label="Usuario" value="user_name_requesting" />
                    <ExcelColumn label="Usuario quien responde" value="user_requested" />
                    <ExcelColumn label="Estado" value="state" />
                    <ExcelColumn label="Respuesta" value="response" />
                </ExcelSheet>
            </ExcelFile>
        )
    }
}