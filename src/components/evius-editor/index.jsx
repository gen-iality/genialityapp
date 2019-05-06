import React, {Component} from 'react';
import {Editor, createEditorState,addNewBlock,Block} from 'medium-draft';
import {EditorState,AtomicBlockUtils} from 'draft-js'
import {setRenderOptions, blockToHTML, entityToHTML, styleToHTML} from '../../helpers/exportEditor';

const newBlockToHTML = (block) => {
    const blockType = block.type;
    if (block.type === Block.ATOMIC) {
        if (block.text === 'E') {
            return {
                start: '<figure class="md-block-atomic md-block-atomic-embed">',
                end: '</figure>',
            };
        } else if (block.text === '-') {
            return <div className="md-block-atomic md-block-atomic-break"><hr/></div>;
        }
    }
    return blockToHTML(block);
};

const newEntityToHTML = (entity, originalText) => {
    if (entity.type === 'embed') {
        return (
            <div>
                <a
                    className="embedly-card"
                    href={entity.data.url}
                    data-card-controls="0"
                    data-card-theme="dark"
                >Embedded ― {entity.data.url}
                </a>
            </div>
        );
    }
    return entityToHTML(entity, originalText);
};

class EviusEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: createEditorState(), // for empty content
        };
        /*
        this.state = {
          editorState: createEditorState(data), // with content
        };
        */
        this.sideButtons = [{
            title: 'Set Image',
            component: ImageButton,
        }, {
            title: 'Separator',
            component: SeparatorSideButton,
        }];

        this.refsEditor = React.createRef();

    }

    componentDidMount() {
        this.refsEditor.current.focus();
    }

    onChange = (editorState) => {
        this.setState({ editorState });
    };

    onClick = () => {
        const currentContent = this.state.editorState.getCurrentContent();
        const eHTML = this.exporter(currentContent);
        this.setState({eHTML});
        //document.getElementById('content').innerHTML = eHTML;
    };

    exporter = setRenderOptions({
        styleToHTML,
        blockToHTML: newBlockToHTML,
        entityToHTML: newEntityToHTML,
    });

    render() {
        const { editorState,eHTML } = this.state;
        return (
            <div className='container'>
                <Editor
                    ref={this.refsEditor}
                    editorState={editorState}
                    sideButtons={this.sideButtons}
                    onChange={this.onChange} />
                <button onClick={this.onClick}>RENDER HTML</button>
                <div id="content" className="content" dangerouslySetInnerHTML={{__html: eHTML}}/>
            </div>
        );
    }
}

class SeparatorSideButton extends Component {
    constructor(props) {
        super(props);
    }

    onClick = () => {
        console.log('CLICK');
        let editorState = this.props.getEditorState();
        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity('separator', 'IMMUTABLE', {});
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        editorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
        this.props.setEditorState(
            AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                '-'
            )
        );
        this.props.close();
    }

    render() {
        return (
            <button
                className="md-sb-button md-sb-img-button"
                type="button"
                title="Add a separator"
                onClick={this.onClick}
            >
                <i className="fa fa-minus" />
            </button>
        );
    }
}

class ImageButton extends Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick() {
        this.input.value = null;
        this.input.click();
    }

    /*
    This is an example of how an image button can be added
    on the side control. This Button handles the image addition locally
    by creating an object url. You can override this method to upload
    images to your server first, then get the image url in return and then
    add to the editor.
    */
    onChange(e) {
        // e.preventDefault();
        const file = e.target.files[0];
        if (file.type.indexOf('image/') === 0) {
            // console.log(this.props.getEditorState());
            // eslint-disable-next-line no-undef
            const src = URL.createObjectURL(file);
            console.log(src);
            this.props.setEditorState(addNewBlock(
                this.props.getEditorState(),
                Block.IMAGE, {
                    src,
                }
            ));
        }
        this.props.close();
    }

    render() {
        return (
            <button
                className="md-sb-button md-sb-img-button"
                type="button"
                onClick={this.onClick}
                title="Add an Image"
            >
                <i className="fa fa-image" />
                <input
                    type="file"
                    accept="image/*"
                    ref={(c) => { this.input = c; }}
                    onChange={this.onChange}
                    style={{ display: 'none' }}
                />
            </button>
        );
    }
}

export default EviusEditor;