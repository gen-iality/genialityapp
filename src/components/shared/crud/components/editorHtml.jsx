import React, {Component} from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



class EditorHtml extends Component {
    constructor(props){
        super(props);
   
      
       }

   
    render() {
       
        return(
            <React.Fragment>
             <CKEditor
                editor={ ClassicEditor }
                 data="<p></p>"
                 readOnly={false}
                onChange={ ( event, editor ) => {
                     const data = editor.getData();
                 alert('djj')
                    // this.handleChangeHtmlEditor(name, data)
                    console.log( { event, editor, data } );
                 } }
             />
    
                
            </React.Fragment>
        )
    }

}

export default EditorHtml;