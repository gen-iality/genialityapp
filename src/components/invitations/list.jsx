import React, {Component} from 'react';
import {FormattedDate, FormattedTime} from "react-intl";
import {Link,withRouter} from "react-router-dom";
import {FaEye, FaSort, FaSortDown, FaSortUp} from "react-icons/fa";
import API from "../../helpers/request"
import Table from "../shared/table";

class InvitationsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations:[],
            pageOfItems:[],
            loading:    true,
            pages:      null,
            pageSize:   25,
            columns:    columns,
            sorted:     []
        };
        this.fetchData = this.fetchData.bind(this);
    }

    async componentDidMount() {
        const { match } = this.props;
        let pos = columns.map((e) => { return e.id; }).indexOf('edit');
        if(pos<=0) columns.push(
            {
                ...this.genericHeaderArrows(),
                headerText: "Fecha",
                id: "created_at",
                accessor: d => d.created_at,
                Cell: props => <span><FormattedDate value={props.value}/> <FormattedTime value={props.value}/></span>,
                width: 180
            },
            {
                ...this.genericHeaderArrows(),
                headerText: "Total",
                id: "number_of_recipients",
                accessor: d => d.number_of_recipients,
                width: 90
            },
            {
            Header: "",
            id: "edit",
            accessor: d => d,
            Cell: props => <Link to={{pathname: `${match.url}/detail`, state: { item: props.value, users:props.value.message_users }}}><FaEye/></Link>,
            width:50
            }
        );
        this.setState({columns,loading:false});
    }

    //Table
    fetchData(state, instance) {
        this.setState({ loading: true });
        this.requestData(
            this.state.invitations,
            this.props.eventId,
            state.pageSize,
            state.page,
            state.sorted
        ).then(res => {
            const page = Math.ceil(res.total/res.perPage);
            this.setState({
                invitations: res.rows,
                pages: page,
                loading: false
            });
        });
    }
    requestData = (invitations, eventId, pageSize, page, sorted) => {
        return new Promise((resolve, reject) => {
            let filteredData = invitations;
            let query = '?';
            if (sorted.length) {
                let querySort = [];
                sorted.map(sort=>{
                    querySort.push({"id":sort.id,"order":sort.desc?"desc":"asc"})
                });
                querySort = JSON.stringify(querySort);
                query = query+`&orderBy=${querySort}`;
            }
            API.get(`/api/events/${eventId}/invitations${query}&page=${page+1}&pageSize=${pageSize}`).then(({data})=>{
                filteredData = data;
                let res = {rows: filteredData.data, total: filteredData.meta.total, perPage: filteredData.meta.per_page};
                resolve(res)
            }).catch(e=>{
                console.log(e);
                this.setState({timeout:true});
            });

        });
    };
    getSortedComponent = (id) => {
        // console.log('getSortedComponent sorted:',this.state.sorted);
        let sortInfo = this.state.sorted.filter(item => item.id === id);
        if (sortInfo.length) {
            // console.log('getSortedComponent sortInfo:',sortInfo[0].desc);
            if (sortInfo[0].desc === true) return <FaSortDown />;
            if (sortInfo[0].desc === false) return <FaSortUp />;
        }
        return <FaSort />;
    };
    genericHeaderArrows = () => {
        return {
            Header: props => {
                const Sorted = this.getSortedComponent(props.column.id);
                return (<span>{props.column.headerText} {Sorted}</span>);
            },
            headerStyle: { boxShadow: "none" }
        };
    };

    render() {
        const { invitations, pageSize, pages, loading } = this.state;
        return (
            <React.Fragment>
                <Table
                    columns={columns}
                    manual
                    data={invitations}
                    loading={loading}
                    onFetchData={this.fetchData}
                    onSortedChange={sorted => this.setState({ sorted })}
                    showPaginationTop={true}
                    showPaginationBottom={false}
                    pages={pages}
                    defaultPageSize={pageSize}
                    className="-highlight"/>
            </React.Fragment>
        );
    }
}

const columns = [{
        Header: "Subject",
        id: "subject",
        accessor: d => d.subject,
        sortable: false,
    }];

export default withRouter(InvitationsList);