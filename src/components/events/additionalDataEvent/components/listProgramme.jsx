import React, {Component} from 'react';
import ModalSpeaker from '../components/modalSpeakers';
import '../styles.css'
class ListProgramme extends Component{

    constructor(props){
        super(props)
        this.state = {
            show: false,
            modal: false,
            speakerData: []
        }
        this.showModal = this.showModal.bind(this)

        console.log('estos son los props, programme ', props)
    }

    showModal(key) {
        // console.log("here speaker", this.props.speakers[key]);
        
        this.setState(prevState => {
            return {modal: true, show: true, speakerData: this.props.speakers[key]}
        });
    };
    
    hideModal = () => {
        this.setState({ show: false });
    };

    render() {

    
        console.log('====|=|======>>>>> ',this.props.sessions)
        return (


            <React.Fragment>
                <br/>   <br/>
                <p className="has-text-grey-dark is-size-2 cabecera">AGENDA</p>
              
                    {/* <table className="table"> 
                    <tbody> */}
                    {/* <tr> <td>kgkjhkjh</td> </tr> */}
                    {
                        this.props.sessions.map((item,key)=>{
                        return  <p>pdhsh</p>
                            }
                            )                                                                                                                                                           
                    }

                    {/* </tbody>
                   </table> */}
            </React.Fragment>
        );
    }
}

export default ListProgramme;
