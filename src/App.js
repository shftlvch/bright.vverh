import React, {Component} from "react";

import "./App.css";
import logo from "./assets/logo-pink.png";
import "./assets/font-awesome/css/font-awesome.css";
import $ from "jquery";
import Typed from "typed.js";
import request from "superagent";
import Dropzone from "react-dropzone";
import DocumentMeta from "react-document-meta";


import Share from "./components/Share";

const CLOUDINARY_UPLOAD_PRESET = 'b9txgygb';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/vverh/upload';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: 'fa-heart',
            placeholders: [
                'я танцую',
                'я пою',
                'винишко и друзья',
                'прихожу в Вверх',
            ],
            file: false,
            fileUrl: '',
            hasImage: false,
            isLoading: false,
            reason: '',
            valid: true,
            imageGenerated: false,
            pic: false,

        };

        this.changeIcon = this.changeIcon.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onReset = this.onReset.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleImageProcess = this.handleImageProcess.bind(this);
    }

    componentDidMount() {

        let btnTimer = setInterval(this.changeIcon, 1000);

        let typed = new Typed('.form__input', {
            strings: this.state.placeholders,
            typeSpeed: 100,
            backSpeed: 10,
            attr: 'placeholder',
            // bindInputFocusEvents: true,
            loop: true,
            // shuffle: true,
        });

        $('.form__input').focus();
        let height = window.innerHeight > 590 ? window.innerHeight : 590;
        $('#fullsize').height(height);
        $('#root').animate({opacity: 1});

    }

    changeIcon() {
        let icon = this.state.icon === 'fa-cloud-upload' ? 'fa-heart' : 'fa-cloud-upload';
        this.setState({icon})
    }

    onDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
        this.handleImageUpload(files[0]);
    }

    onSend() {
        if (!this.state.reason) {
            let timerId = setInterval(() => {
                this.setState({valid: !this.state.valid});
            }, 100);

            setTimeout(() => {
                clearInterval(timerId);
                this.setState({valid: true});
            }, 1500);
        } else {
            this.setState({isLoading: true});
            this.handleImageProcess();

        }
        console.log('send');

    }

    onReset() {
        this.setState(
            {
                pic: false,
                imageGenerated: false,
                isLoading: false,
                hasImage: false,
                valid: true,
                file: false,
                fileUrl: '',
            }
        );
    }

    handleChange(event) {
        this.setState({reason: event.target.value});
    }

    handleImageProcess() {
        let req = request.post(process.env.NODE_ENV === 'production' ? '/api/process' : 'http://localhost:3001/api/process')
            .send({'reason': this.state.reason})
            .send({'image': this.state.fileUrl})
            .send({'file': this.state.file});

        req.end((err, response) => {
            if (err) {
                console.error(err);
            }
            if (response.hasOwnProperty('body') && response.body !== '') {
                console.error(response.body);
                this.setState({
                    pic: response.body.data.object.url,
                    imageGeneratedHash: response.body.data.object.public_id,
                    imageGenerated: true,
                    backgroundColor: App.getRGBA(response.body.data.vibrant, 0.8)
                });
            }
        });
    }

    handleImageUpload(file) {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', file);

        this.setState({isLoading: true});

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== '') {
                this.setState({
                    fileUrl: response.body.secure_url,
                    file: response.body,
                    hasImage: true,
                    isLoading: false,
                    backgroundColor: App.getRGBA([229, 106, 99], 0.8)
                });
                this.onSend();
            }
        });
    }

    static getRGBA(color, opacity) {
        return `rgba(${Math.floor(color[0])}, ${Math.floor(color[1])}, ${Math.floor(color[2])}, ${opacity}) `
    }

    render() {
        let state = this.state,
            icon = state.icon,
            placeholder = state.placeholders[state.placeholder];

        const meta = {
            title: `#мне_не_серо_когда — Центр равных возможностей для детей-сирот «Вверх»`,
            description: 'Продержитесь до праздников, расскажите друзьям что помогает вам бороться с серостью и не унывать эти 7 месяцев в году.',
            canonical: `http://bright.vverh.su/`,
            meta: {
                charSet: 'utf-8',
                name: {
                    keywords: '#мне_не_серо_когда, Вверх, благотворительность, свет, несерость, зима, позитивное мышление, Центр равных возможностей для детей-сирот'
                },
                property: {
                    'og:image': '',
                }
            },
            auto: {
                ograph: true
            }
        };

        return (
            <DocumentMeta {...meta}>
                <div id="fullsize">
                    <div className="image" style={{backgroundImage: 'url(' + this.state.fileUrl + ')'}}/>
                    <div className="container"
                         style={{backgroundColor: this.state.backgroundColor ? this.state.backgroundColor : App.getRGBA([229, 106, 99, 1])}}>
                        <a href="https://vverh.su/" target="_blank" rel="noopener noreferrer" className="logo"><img
                            className="logo__image"
                            src={logo}/></a>
                        {!this.state.imageGenerated ? <div className="form-wrapper">
                            <div className="form">
                                <header className="form__header">#мне_не_серо_когда</header>
                                <input className={'form__input ' + (!this.state.valid ? 'form__input_error' : '') }
                                       maxLength="20"
                                       value={this.state.reason} onChange={this.handleChange}
                                       placeholder={placeholder}/>
                                {!this.state.hasImage ?
                                    <Dropzone className="form__file btn" onDrop={this.onDrop.bind(this)}
                                              disabled={this.state.isLoading}
                                              accept="image/jpeg,image/png,image/gif">

                                        {!this.state.isLoading ? <span><i className={"fa " + icon}
                                                                     aria-hidden="true"/> Сэлфи или картинка</span> :
                                            <span><i className="fa fa-refresh fa-spin fa-fw"
                                                     aria-hidden="true"/> Подождите, пожалуйста</span>}
                                    </Dropzone> :
                                    <button className="form__btn btn"
                                            disabled={this.state.isLoading}
                                            onClick={this.onSend}
                                    >
                                        {!this.state.isLoading ?  <span><i className={"fa " + icon}
                                                                           aria-hidden="true"/> Сделать картинку</span> :
                                            <span><i className="fa fa-refresh fa-spin fa-fw"
                                                     aria-hidden="true"/> Делаем красоту...</span>}
                                    </button>
                                }
                            </div>
                        </div> :
                            <div className="result">
                                <img className="result__image" src={this.state.pic}/>
                                <div className="result__share-label">Поделитесь мотивацией:</div>
                                <Share className="result__share"
                                       title={`#мне_не_серо_когда ${this.state.reason} — Центр «Вверх»`}
                                       url={`http://bright.vverh.su/view/${this.state.imageGeneratedHash}`}
                                       image={this.state.pic}
                                />
                                <a href="https://vverh.su/campaign/help/"
                                   target="_blank" rel="noopener noreferrer"
                                   className="btn btn_donate result__donate">
                                    <i className="fa fa-heart-o" aria-hidden="true"/>
                                    Помочь «Вверху»
                                </a>
                                <button className="btn result__reset" onClick={this.onReset}>
                                    <i className="fa fa-refresh" aria-hidden="true"/>
                                    Начать заново
                                </button>
                            </div>
                        }
                        <div className="note">
                            <div className="note__line"/>
                            <p className="note__text">Как побороть серость вокруг и дотянуть до праздников? Пожаловаться
                                в соцсетях? Нет, этот
                                путь не для нас. Наоборот, расскажите друзьям что держит вас в колее и помогает не
                                унывать эти 7 месяцев в году.</p>
                            <div className="note__copy">Сделано с <a target="_blank" rel="noopener noreferrer"
                                                                     href="https://www.facebook.com/daniil.dntcare">אהבה</a>
                            </div>
                        </div>
                    </div>
                </div>
            </DocumentMeta>
        );
    }
}

export default App;
