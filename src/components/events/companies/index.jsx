import { notification } from 'antd'
import { isNonEmptyArray } from 'ramda-adjunct'
import React, { Component } from "react"

import CompanyStand from './exhibitor/Exhibitor'
import { getEventCompanies } from "../../empresas/services"
import './Exhibitors.css';

const standImage =
  'https://firebasestorage.googleapis.com/v0/b/hey-48c29.appspot.com/o/events%2FScreen%20Shot%202020-07-10%20at%203.54.51%20PM%20(1).png?alt=media&token=31afe6c9-f35a-4423-9f7b-ef8eaed2a6b6';

class Company extends Component {
  constructor(props) {
    super(props)
    this.state = {
      companies: [],
      companyItem: {},
      showItem: false
    }
    this.showList = this.showList.bind(this)
    this.showListItem = this.showListItem.bind(this)
  }

  componentDidMount() {
    const { eventId } = this.props

    if (eventId) {
      getEventCompanies(eventId)
        .then((companies) => {
          this.setState({ companies })
        })
        .catch((error) => {
          console.error(error)
          notification.error({
            message: 'Error',
            description: 'Ha ocurrido un error obteniendo las empresas'
          })
        })
    } else {
      notification.error({
        message: 'Error',
        description: 'No se encuentra el event ID'
      })
    }
  }

  showListItem(companyItem) {
    this.setState({ companyItem, showItem: true })
  }

  showList() {
    this.setState({ showItem: false });
  }

  render() {
    const { companies, showItem, companyItem } = this.state

    if (showItem) {
      return <CompanyStand data={companyItem} goBack={this.showList} />
    }

    return (
      <div className='main-exhibitor-list'>
        <div className='iso-exhibitor-list'>
          <div className='iso-exhibitor-list-wrap'>
            {isNonEmptyArray(companies) && companies.map((company) => {
              return (
                <button
                  key={`list-item-${company.id}`}
                  type="button"
                  className='iso-exhibitor-list-item'
                  onClick={() => this.showListItem(company)}
                >
                  <div className='iso-exhibitor-list-item-image'>
                    <img src={standImage} alt='' />
                  </div>
                  <div className='iso-exhibitor-list-item-description'>
                    <span></span> {company.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default Company;
