import React, {Component} from "react";
import DocumentMeta from 'react-document-meta';


export default class View extends Component {

    render() {
        const meta = {
            title: 'Some Meta Title',
            description: 'I am a description, and I can create multiple tags',
            canonical: 'http://example.com/path/to/page',
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: 'react,meta,document,html,tags'
                }
            }
        };

        return (
            <DocumentMeta {...meta}>
                <div>
                    HELLO
                </div>
            </DocumentMeta>

        );
    }
}