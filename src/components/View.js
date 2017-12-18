import React, {Component} from "react";
import DocumentMeta from "react-document-meta";
import {Redirect} from "react-router";
import {MainApi} from "../api";


export default class View extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        console.log('will mount');
        this._handleData('view');
    }

    componentDidMount() {
        window.location.replace("/");
    }

    async _handleData(key) {
        const {staticContext} = this.props

        if (staticContext && staticContext.data[key]) {
            // const o = staticContext.data[key]
            // this.setState({o});
        } else if (staticContext) {
            staticContext.data[key] = this._getData()
        } else if (!staticContext && window.DATA[key]) {
            const o = window.DATA[key];
            console.log('window: ', o);

            this.props.staticContext = {
                data: {[key]: o.data}
            };
            window.DATA[key] = null
        } else if (!staticContext) {
            const o = await this._getData()
            console.log('no staticContext: ', o);
            this.setState({static: o.data})
        }
    }

    async _getData() {
        const {staticContext} = this.props;
        const Api = staticContext ? staticContext.api.MainApi : MainApi;
        const myApi = new Api();
        const object = await myApi.getEntry(this.props.match.params.hash);
        return object;
    }

    render() {
        console.log('render');
        console.log(this.props);
        console.log(this.state);
        console.log(this.props.staticContext);


        let meta, view, reason = '', pic = '';



        if (this.props.staticContext || this.state.static) {
            console.log('has staticContext');

            view = this.props.staticContext ? this.props.staticContext.data.view: this.state.static;
            reason = '';
            pic = false;

            if (typeof view.then !== 'function') {
                console.log(view);

                reason = view.reason;
                pic = view.pic;
            }

            meta = {
                title: `#мне_не_серо_когда ${reason} — Центр «Вверх»`,
                description: 'Продержитесь до праздников, расскажите друзьям что помогает вам бороться с серостью и не унывать эти 7 месяцев в году.',
                canonical: `http://bright.vverh.su/view/${this.props.match.params.hash}`,
                meta: {
                    charSet: 'utf-8',
                    name: {
                        keywords: '#мне_не_серо_когда, Вверх, благотворительность, свет, несерость, зима, позитивное мышление, Центр равных возможностей для детей-сирот'
                    },
                    property: {
                        'og:image': pic ? pic.url : '',
                    }
                },
                auto: {
                    ograph: true
                }
            };
        }
        console.log('meta:', meta);


        return (
            <DocumentMeta {...meta}>

                <h2>{reason}</h2>
                {/*<Redirect to="/" push/>*/}
            </DocumentMeta>

        );


    }

}
