import { Component, Fragment } from 'react';
import ComponentTest from './componentTest';
import API from '@helpers/request';
import { firestore } from '@helpers/firebase';
import { FormattedMessage, useIntl } from 'react-intl';
import { GetTokenUserFirebase } from 'helpers/HelperAuth';
import { DispatchMessageService } from '@context/MessageService';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: false,
      usuarioRegistrado: false,
    };
  }

  async componentDidMount() {
    const evius_token = await GetTokenUserFirebase();
    const resp = await API.get(`/auth/currentUser?evius_token=${evius_token}`);

    if (resp.status !== 200 && resp.status !== 202) {
      return;
    }

    const data = resp.data;

    const userRef = firestore
      .collection(`${this.props.event._id}_event_attendees`)
      .where('properties.email', '==', data.email)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          DispatchMessageService({
            type: 'error',
            msj: 'Usuario no inscrito a este curso, contacte al administrador',
            action: 'show',
          });

          this.setState({ currentUser: false });
          return;
        }

        this.setState({ currentUser: true });

        snapshot.forEach((doc) => {
          const user = firestore.collection(`${this.props.event._id}_event_attendees`).doc(doc.id);

          user
            .update({
              updated_at: new Date(),
              checked_in: true,
              checked_at: new Date(),
            })
            .then(() => {
              // Disminuye el contador si la actualizacion en la base de datos se realiza
              DispatchMessageService({
                type: 'success',
                msj: 'Usuario inscrito',
                action: 'show',
              });
              this.setState({ usuarioRegistrado: true });
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
              DispatchMessageService({
                type: 'error',
                msj: this.props.intl.formatMessage({ id: 'toast.error', defaultMessage: 'Error :('}),
                action: 'show',
              });
            });
        });
      })
      .catch((err) => {});
  }

  render() {
    return (
      <Fragment>
        <ComponentTest
          testData="prueba de dato"
          validate
          event={this.props.event}
          currentUser={this.state.currentUser}
          usuarioRegistrado={this.state.currentUser}
        />
      </Fragment>
    );
  }
}

export default Test;
