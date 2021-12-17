import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertToRaw, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';

const TextEditor = (props) => {
    const [editorState, setEditorState] = useState(props.editorState);
    const [editorData, setEditorData] = useState();
    const editor = useRef();
  
    function focusEditor() {
      editor.current.focus();
    }

    useEffect(() => {
        focusEditor();
        handleSend();
    },[editorState])

    const handleSend = () => {
        props.sendToParent(editorData)
    }

    const StyleButton = (props) => {
        let onClickButton = (e) => {
            e.preventDefault();
            props.onToggle(props.style);
        };

        return <span className="RichEditor-styleButton" onMouseDown={onClickButton}>{props.label}</span>;
    }

    const BLOCK_TYPES = [
        { label: "قائمة غير مرتبة", style: "unordered-list-item" },
        { label: "قائمة مرتبة", style: "ordered-list-item" }
    ];

    const BlockStyleControls = (props) => {
        return(
            <div>
                {BLOCK_TYPES.map((type) => {
                    return(
                        <StyleButton
                            key={type.label}
                            label={type.label}
                            style={type.style}
                            onToggle={props.onToggle}
                        />
                    )
                })}
            </div>
        )
    }
    const onBlockClick = (e) => {
        let nextState = RichUtils.toggleBlockType(editorState, e);
        setEditorState(nextState);
      };


    return(
        <div onClick={focusEditor} className="RichEditor-root">
            <div className="RichEditor-controls">
                <BlockStyleControls onToggle={onBlockClick} />
            </div>
            <div className="RichEditor-editor">
            <Editor 
                ref={editor}
                editorState={editorState} 
                onChange={(editorState) => {
                    setEditorState(editorState)
                    setEditorData(JSON.stringify(convertToRaw(editorState.getCurrentContent())))
                    handleSend()
                }} 
            />
            </div>
        </div>
    )
}

export default TextEditor;