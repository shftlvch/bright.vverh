import React, {Component} from "react";
import DocumentMeta from "react-document-meta";
import {Redirect} from "react-router";


export default class View extends Component {

    constructor(props) {
        super(props);
    }



    render() {
        const meta = {
            title: 'Some Meta Title',
            description: 'I am a description, and I can create multiple tags',
            canonical: 'http://example.com/path/to/page',
            meta: {
                charSet: 'utf-8',
                name: {
                    keywords: 'react,meta,document,html,tags'
                },
                property: {
                    'og:image': 'http://example.com/image.jpg',
                }
            },
            auto: {
                ograph: true
            }
        };

        return (
            <DocumentMeta {...meta}>
                {/*<Redirect to="/" push/>*/}
            </DocumentMeta>

        );
    }
}