import React, {Component} from "react";

import "./App.css";
import logo from "./assets/logo.png";
import "./assets/font-awesome/css/font-awesome.css";
import $ from "jquery";
import Typed from "typed.js";
import request from "superagent";
import Dropzone from "react-dropzone";

import Share from './components/Share';

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
        let height = $(window).height() > 640 ? $(window).height() : 640;
        $('#fullsize').height(height);
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
                this.setState({pic: response.body.data.object.url});
                this.setState({imageGenerated: true});
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
                });
            }
        });
    }

    render() {
        let state = this.state,
            icon = state.icon,
            placeholder = state.placeholders[state.placeholder];
        return (
            <div id="#fullsize">
                <div className="image" style={{backgroundImage: 'url(' + this.state.fileUrl + ')'}}/>
                <div className="container"
                     style={{backgroundColor: this.state.hasImage ? 'rgba(229, 106, 99, .8)' : 'rgba(229, 106, 99, 1)'}}>
                    <a href="https://vverh.su/" target="_blank" rel="noopener noreferrer" className="logo"><img
                        className="logo__image"
                        src={logo}/></a>
                    {!this.state.imageGenerated ? <div className="form-wrapper">
                        <div className="form">
                            <header className="form__header">#мне_не_серо_когда</header>
                            <input className={'form__input ' + (!this.state.valid ? 'form__input_error' : '') }
                                   maxlength="20"
                                   value={this.state.reason} onChange={this.handleChange} placeholder={placeholder}/>
                            {!this.state.hasImage ?
                                <Dropzone className="form__file" onDrop={this.onDrop.bind(this)}
                                          accept="image/jpeg,image/png,image/gif">

                                    {!this.state.isLoading ? [<i className={"fa " + icon}
                                                                 aria-hidden="true"/>, 'Сэлфи или картинка'] :
                                        <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"/>}
                                </Dropzone> :
                                <div className="form__btn" onClick={this.onSend}>
                                    {!this.state.isLoading ? [<i className={"fa " + icon}
                                                                 aria-hidden="true"/>, 'Сделать картинку'] :
                                        <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"/>}
                                </div>
                            }
                        </div>
                    </div> :
                        <div className="result">
                            <img className="result__image" src={this.state.pic}/>
                            <Share/>
                        </div>
                    }
                    <div className="note">
                        <div className="note__line"/>
                        <p className="note__text">Как побороть серость вокруг? Пожаловаться в соцсетях? Нет, этот
                            путь не для нас. Наоборот, расскажите друзьям что держит вас в колее и помогает не
                            унывать эти 7 месяцев в году.</p>
                        <div className="note__copy">Сделано с <a target="_blank" rel="noopener noreferrer"
                                                                 href="https://www.facebook.com/daniil.dntcare">אהבה</a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
