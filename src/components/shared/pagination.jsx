import React, {Component} from 'react';

class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pager: {},
            datos: []
        };
    }

    componentWillReceiveProps = (next) => {
        console.log(next);
        if (next.items !== this.props.items) {
            let auxArr = next.items;
            this.setPage(next.initialPage, auxArr);
        }
    }

    setPage = (page, items) => {
        const pageSize = 10;
        let pageOfItems;
        const pager = this.getPager(items.length, page, pageSize);

        this.setState({ pager: pager, datos: items });

        if (items.length > 0) {
            pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
        } else {
            pageOfItems = [];
        }

        this.props.onChangePage(pageOfItems);
    }

    getPager = (totalItems, currentPage, pageSize) => {
        currentPage = currentPage || 1;
        pageSize = pageSize || 10;
        const totalPages = Math.ceil(totalItems / pageSize);

        let startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        const pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    render() {
        const totalItemsCount = this.props.totalItemsCount / 10;
        let pages = [];
        for (let i = 0; i < totalItemsCount; ++i) {
            pages.push(i + 1);
        }
        let pager = this.state.pager;
        if (!pager.pages || pager.pages.length <= 1) {
            return null;
        }
        return (
            <nav className="pagination is-centered" role="navigation" aria-label="pagination">
                <a onClick={() => this.setPage((pager.currentPage - 1), this.state.datos)} className={`button pagination-previous ${pager.currentPage === 1 ? 'disabled' : ''}`}>
                    <span className="icon">
                        <i className="fas fa-angle-double-left"/>
                    </span>
                </a>
                <a onClick={() => this.setPage((pager.currentPage + 1), this.state.datos)} className={`button pagination-next ${pager.currentPage === pager.totalPages ? 'disabled' : ''}`}>
                    <span className="icon">
                        <i className="fas fa-angle-double-right"/>
                    </span>
                </a>
                <ul className="pagination-list">
                    {pager.pages.map((page, index) =>
                        <li key={index} onClick={() => this.setPage(page, this.state.datos)}>
                            <a className={`pagination-link ${pager.currentPage === page ? 'is-current':''}`}>{page}</a>
                        </li>
                    )}
                </ul>
            </nav>
        );
    }
}

export default Pagination;