import React, {Component} from 'react';
import '../crud.css'
import Table from '../../table';
import Pagination from "../../../shared/pagination";
import {Editor, EditorState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';
class EditarHtml extends Component {
    constructor(props){
        super(props);
        //convertimos el html en un objeto que el WYSIWYG lo pueda leer
        // let dataEditor = stateFromHTML(this.props.value);
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^ ',this.props.value ,)
        let editorState = EditorState.createEmpty(this.props.value)
       this.state = {
         editorState: editorState, // for empty content
       }
  
       this.onChange = (editorState) => {
        this.setState({ editorState });
        let html = stateToHTML(editorState.getCurrentContent());

        //convertimos el objeto que devuelve el WYSIWYG en html para enviarlo al componente padre   
        this.props.handleChangeHtmlEditor(this.props.name, html)
      };


       
     
    }

  

    render() {
        const { editorState } = this.state;
  
        return(
            <React.Fragment>
                
                <Editor
           
               editorState={editorState}
               onChange={this.onChange} />
            
            </React.Fragment>
        )
    }

}

export default EditarHtml;