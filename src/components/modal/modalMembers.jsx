import React, { useState } from 'react';
import { firestore } from '../../helpers/firebase';
import { OrganizationApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
// import { Redirect } from 'react-router-dom';
import { Actions } from '../../helpers/request';
import FormComponent from '../events/registrationForm/form';
import { message, Modal } from 'antd';
// import withContext from '../../Context/withContext';
import { DeleteOutlined } from '@ant-design/icons';

function ModalMembers(props) {
   console.log('10. props ', props);
   const [loadingregister, setLoadingregister] = useState(false);

   const options = [
      {
         type: 'danger',
         text: 'Eliminar/Borrar',
         icon: <DeleteOutlined />,
         action: () => deleteUser(props.value),
      },
   ];

   async function deleteUser(user) {
      console.log('10. usuario eliminado ', user);
      // let resultado = null;
      //   const userRef = !this.props.byActivity
      //      ? firestore.collection(`${this.props.cEvent.value?._id}_event_attendees`)
      //      : firestore
      //           .collection(`${this.props.cEvent.value?._id}_event_attendees`)
      //           .doc('activity')
      //           .collection(`${this.props.activityId}`);
      try {
         //  await Actions.delete(`/api/events/${props.cEvent.value?._id}/eventusers`, user._id);
         props.closeOrOpenModalMembers()
         message.success('Eliminado correctamente');
      } catch (e) {
         message.error('Hubo un error al eliminar');
         ///Esta condición se agrego porque algunas veces los datos no se sincronizan
         //bien de mongo a firebase y terminamos con asistentes que no existen
         //  if (e.response && e.response.status === 404) {
         //     let respdelete1 = await UsersApi.deleteUsers('615dd4876a959d694a2a7ab6');
         //     let respdelete2 = await UsersApi.deleteUsers('615ddb385dae82055078a544');
         //     console.log('RESPDELETE==>', respdelete1);
         //     console.log('RESPDELETE2==>', respdelete1);
         //     userRef.doc(user._id).delete();
         //     message.success('Eliminado correctamente');
         //  } else {
         //     messages = { class: 'msg_danger', content: e };
         //     message.error('Error al eliminar');
         //  }
      }

      //Borrado de usuario en Firebase
      //   userRef
      //      .doc(userId)
      //      .delete()
      //      .then(function() {
      //         message.class = 'msg_warning';
      //         message.content = 'USER DELETED';
      //         toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      //      });
   }

   //    function closeModal() {
   //       let message = { class: '', content: '' };
   //       this.setState({ user: {}, valid: true, modal: false, uncheck: false, message }, props.handleModal());
   //    }

   async function saveUser(values) {
      setLoadingregister(true);
      console.log('10. callback=>', values);
      let resp;

      const snap = { properties: values };
if(props.editMember){
console.log("10. editando")
}else{
    console.log("10. creando")
}
    //   resp = await OrganizationApi.saveUser(props.organizationId, snap);
    //   console.log('10. resp ', resp);

      //  if (props.updateView) {
      //     console.log('10. ingreseeee');
      //     await props.updateView();
      //  }

      if (resp) {
         message.success('Usuario agregado correctamente');
         props.closeOrOpenModalMembers()
      } else {
         message.error('No fue posible agregar el Usuario');
      }
   }

   return (
      <Modal closable footer={false} onCancel={() => props.handleModal()} visible={true}>
         <div
            // className='asistente-list'
            style={{
               paddingLeft: '0px',
               paddingRight: '0px',
               paddingTop: '0px',
               paddingBottom: '0px',
               marginTop: '30px',
            }}>
            <FormComponent
               conditionalsOther={[]}
               initialOtherValue={props.value}
               eventUserOther={{}}
               fields={props.extraFields}
               organization={true}
               options={options}
               callback={saveUser}
               loadingregister={loadingregister}
            />
         </div>
      </Modal>
   );
}

export default ModalMembers;
