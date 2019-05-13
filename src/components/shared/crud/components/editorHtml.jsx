import React, {Component} from 'react';
import '../crud.css'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState,convertFromRaw ,convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import 'draft-js-static-toolbar-plugin/lib/plugin.css';

class EditarHtml extends Component {
    constructor(props){
        super(props);
        this.state = {
            editorState : EditorState.createEmpty(),
       }
       console.log('ppopopopo ',this.props)
       if (this.props.value) {
           //si tiene contenido lo muestra para editar
        const rawContentFromStore = convertFromRaw(JSON.parse(this.props.value.value));
        var editorState =EditorState.createWithContent(rawContentFromStore);
    }else{
        // de lo contrario inicia el archivo vacio
        var editorState = EditorState.createEmpty()
    }
    
   this.state = {
     editorState: editorState, // for empty content
   }
    }
   

   
    onEditorStateChange = (editorState) => {
   
     
        this.setState({
          editorState,
        });
        let html = editorState.getCurrentContent()
        let dataEditor = convertToRaw(editorState.getCurrentContent());
        
        let info = {value :JSON.stringify(dataEditor) ,html: stateToHTML(html) }
        // console.log('esta esta convertida en raw ', html)
        //convertimos el objeto que devuelve el WYSIWYG en html para enviarlo al componente padre   
        this.props.handleChangeHtmlEditor(this.props.name ,info)
        console.log('esto ---------------->> >> ',JSON.stringify(dataEditor) ,stateToHTML(html))
        // console.log(editorState)
      };
    
  
    render() {
        const { editorState } = this.state;
       
        return(
            <React.Fragment>
                <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={this.onEditorStateChange}
                    />
            </React.Fragment>
        )
    }

}

export default EditarHtml;