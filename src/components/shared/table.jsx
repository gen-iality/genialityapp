import React, {Component} from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";

class Table extends Component {
    render() {
        const props = this.props;
        return (
            <ReactTable {...props}/>
        );
    }
}

export default Table;