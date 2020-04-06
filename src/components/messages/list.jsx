import React, { Component } from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import { Link, withRouter } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import API from "../../helpers/request";
import Table from "../shared/table";

class InvitationsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitations: [],
      pageOfItems: [],
      loading: true,
      pages: null,
      pageSize: 25,
      columns: columns,
      sorted: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    let pos = this.state.columns
      .map((e) => {
        return e.id;
      })
      .indexOf("edit");

    let editaction = {
      Header: "",
      id: "edit",
      accessor: (d) => d,
      Cell: (props) => (
        <Link
          to={{
            pathname: `${match.url}/detail`,
            state: { item: props.value, users: props.value.message_users },
          }}
        >
          <FaEye />
        </Link>
      ),
      width: 50,
    };
    if (pos < 0) {
      columns.unshift(editaction);
    } else {
      columns[pos] = editaction;
    }

    this.setState({ columns: [...columns], loading: false });

    this.fetchData(this.state);
  }

  componentWillUnmount() {
    this.setState({ invitations: [] });
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
    ).then((res) => {
      const page = Math.ceil(res.total / res.perPage);
      this.setState({
        invitations: res.rows,
        pages: page,
        loading: false,
      });
    });
  }

  requestData = (invitations, eventId, pageSize, page, sorted) => {
    return new Promise((resolve, reject) => {
      let filteredData = invitations;
      let query = "?";
      if (sorted.length) {
        let querySort = [];
        sorted.map((sort) => {
          return querySort.push({
            id: sort.id,
            order: sort.desc ? "desc" : "asc",
          });
        });
        querySort = JSON.stringify(querySort);
        query = query + `&orderBy=${querySort}`;
      }

      API.get(
        `/api/events/${eventId}/messages${query}&page=${
          page + 1
        }&pageSize=${pageSize}`
      )
        .then(({ data }) => {
          filteredData = data;
          console.log(data);
          let res = {
            rows: filteredData.data,
            total: filteredData.meta.total,
            perPage: filteredData.meta.per_page,
          };
          resolve(res);
        })
        .catch((e) => {
          console.log(e);
          this.setState({ timeout: true });
        });
    });
  };

  goToDetail = (row) => {
    console.log("GOTODETAIL", row);
  };

  render() {
    const { invitations, pageSize, pages, loading } = this.state;
    return (
      <React.Fragment>
        {
          <Table
            onRowClick={this.goToDetail}
            columns={this.state.columns}
            manual
            data={invitations}
            loading={loading}
            onFetchData={this.fetchData}
            showPaginationTop={true}
            showPaginationBottom={false}
            pages={pages}
            defaultPageSize={pageSize}
            className="-highlight"
          />
        }
      </React.Fragment>
    );
  }
}

let columns = [
  {
    Header: "Subject",
    id: "subject",
    accessor: (d) => d.subject,
    sortable: false,
    Cell: (props) => props.value,
  },
  {
    Header: "Fecha",
    id: "created_at",
    accessor: (d) => d.created_at,
    Cell: (props) => (
      <span>
        <FormattedDate value={props.value} />{" "}
        <FormattedTime value={props.value} />
      </span>
    ),
    width: 180,
  },
  {
    Header: "Total",
    id: "number_of_recipients",
    accessor: (d) => d.number_of_recipients,
    width: 90,
  },
  {
    Header: "Request",
    id: "request",
    accessor: (d) => d.request,
    width: 90,
  },
  {
    Header: "Delivered",
    id: "delivered",
    accessor: (d) => d.delivered,
    width: 90,
  },
  {
    Header: "Unique",
    id: "unique_opened",
    accessor: (d) => d.unique_opened,
    width: 90,
  },
  {
    Header: "Opened",
    id: "opened",
    accessor: (d) => d.opened,
    width: 90,
  },
  {
    Header: "Click",
    id: "click",
    accessor: (d) => d.click,
    width: 90,
  },
];

export default withRouter(InvitationsList);
