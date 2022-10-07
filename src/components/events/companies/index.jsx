import { notification } from 'antd';
import { isFunction, isNonEmptyArray } from 'ramda-adjunct';
import { Component } from 'react';
import { handleRequestError } from '@helpers/utils';
import { fireStoreApi } from '@helpers/request';
import CompanyStand from './exhibitor/Exhibitor';
import { getEventCompanies } from '../../empresas/services';
import './Exhibitors.css';
import { DispatchMessageService } from '../../../context/MessageService';

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      standsListTopScroll: 0,
      companies: [],
      shownCompanyIndex: -1,
    };
    this.standsListRef = React.createRef();
  }

  componentDidMount() {
    const { eventId } = this.props;

    if (eventId) {
      getEventCompanies(eventId)
        .then((rawCompanies) => {
          const companies = rawCompanies.sort((a, b) =>
            a.stand_type > b.stand_type ? 1 : a.stand_type === b.stand_type ? (a.name > b.name ? 1 : -1) : -1
          );

          this.setState({ companies });
        })
        .catch((error) => {
          console.error(error);
          notification.error({
            message: `Error '${eventId}'`,
            description: `Ha ocurrido un error obteniendo las empresas: ${error}`,
          });
        });
    } else {
      notification.error({
        message: 'Error',
        description: 'No se encuentra el event ID',
      });
    }
  }

  setStandsListScrollToLastPosition = () => {
    if (this.standsListRef.current) {
      this.standsListRef.current.scrollTop = this.state.standsListTopScroll;
    }
  };

  showListItem = (companyIndex) => {
    this.setState({ shownCompanyIndex: companyIndex });
    const { eventId, eventUser } = this.props;
    const { companies } = this.state;
    let companyItem = companies[companyIndex];

    if (eventUser && eventUser._id && companyItem.visitors_space_id) {
      fireStoreApi
        .createOrUpdate(eventId, companyItem.visitors_space_id, eventUser)
        .then(() => {
          DispatchMessageService({
            type: 'success',
            msj: 'Asistente agregado a lección',
            action: 'show',
          });
          this.setState({ qrData: {} });
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
          DispatchMessageService({
            type: 'error',
            msj: handleRequestError(error),
            action: 'show',
          });
        });
    }
  };

  showList = () => {
    this.setState({ shownCompanyIndex: -1 }, this.setStandsListScrollToLastPosition);
  };

  onScrollStandsList = () => {
    if (this.standsListRef.current) {
      const standsListTopScroll = this.standsListRef.current.scrollTop;
      this.setState({ standsListTopScroll });
    }
  };

  showPreviousCompany = () => {
    const { companies, shownCompanyIndex } = this.state;

    if (shownCompanyIndex >= 0 && companies.length > 0) {
      const lastCompanyIndex = companies.length - 1;
      const previousCompanyIndex = shownCompanyIndex - 1;
      const validPreviousIndex = companies[previousCompanyIndex] ? previousCompanyIndex : lastCompanyIndex;

      this.setState({ shownCompanyIndex: validPreviousIndex });
    }
  };

  showNextCompany = () => {
    const { companies, shownCompanyIndex } = this.state;

    if (shownCompanyIndex >= 0 && companies.length > 0) {
      const nextCompanyIndex = shownCompanyIndex + 1;
      const validNextIndex = companies[nextCompanyIndex] ? nextCompanyIndex : 0;
      this.setState({ shownCompanyIndex: validNextIndex });
    }
  };

  render() {
    const { goBack } = this.props;
    const { companies, shownCompanyIndex } = this.state;

    if (shownCompanyIndex >= 0 && companies[shownCompanyIndex]) {
      return (
        <CompanyStand
          data={companies[shownCompanyIndex]}
          goBack={this.showList}
          showPrevious={this.showPreviousCompany}
          showNext={this.showNextCompany}
        />
      );
    }

    return (
      <div className='main-exhibitor-list'>
        <button
          type='button'
          className='main-stand-goback'
          onClick={() => {
            if (isFunction(goBack)) {
              this.showList();
              goBack();
            }
          }}>
          <img src='/exhibitors/icons/baseline_arrow_back_white_18dp.png' alt='' />
          Regresar
        </button>
        <div className='iso-exhibitor-list' ref={this.standsListRef} onScroll={this.onScrollStandsList}>
          <div className='iso-exhibitor-list-wrap'>
            {isNonEmptyArray(companies) &&
              companies.map((company, companyIndex) => {
                return (
                  <button
                    key={`list-item-${company.id}`}
                    type='button'
                    className='iso-exhibitor-list-item'
                    onClick={() => this.showListItem(companyIndex)}>
                    <div className='iso-exhibitor-list-item-image'>
                      <img src={company.list_image} alt='' />
                    </div>
                    <div className='iso-exhibitor-list-item-description'>
                      <span></span> {company.name}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
        <div className='scroll-down'>
          <div className='scroll-down-label'>
            Haz scroll para ver
            <br />
            todos los stands
          </div>
          <div className='scroll-down-image'>
            <img alt='scdown' src='/exhibitors/scdown.gif' />
          </div>
        </div>
      </div>
    );
  }
}

export default Company;
