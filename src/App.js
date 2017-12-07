import React, {Component} from "react";

import "./App.css";
import logo from "./assets/logo.png";
import "./assets/font-awesome/css/font-awesome.css";
import $ from "jquery";
import Typed from "typed.js";
import request from "superagent";
import Dropzone from "react-dropzone";

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
            fileUrl: '',
            hasImage: false,
            isLoading: false,
            reason: '',
            valid: true,
            imageGenerated: false
        };


        this.changeIcon = this.changeIcon.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.onSend = this.onSend.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
            this.setState({imageGenerated: true});
        }


        console.log('send');

    }

    handleChange(event) {
        this.setState({reason: event.target.value});
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
            <div>
                <div className="image" style={{backgroundImage: 'url(' + this.state.fileUrl + ')'}}/>
                <div className="container"
                     style={{backgroundColor: this.state.hasImage ? 'rgba(229, 106, 99, .8)' : 'rgba(229, 106, 99, 1)'}}>
                    <a href="https://vverh.su/" target="_blank" className="logo"><img className="logo__image"
                                                                                      src={logo}/></a>
                    {!this.state.imageGenerated ? <div className="form-wrapper">
                        <div className="form">
                            <header className="form__header">#мне_не_серо_когда</header>
                            <input className={'form__input ' + (!this.state.valid ? 'form__input_error' : '') }
                                   value={this.state.reason} onChange={this.handleChange} placeholder={placeholder}/>
                            {!this.state.hasImage ?
                                <Dropzone className="form__file" onDrop={this.onDrop.bind(this)}
                                          accept="image/jpeg,image/png,image/gif">

                                    {!this.state.isLoading ? [<i className={"fa " + icon}
                                                                 aria-hidden="true"/>, 'Сэлфи или картинка'] :
                                        <i className="fa fa-refresh fa-spin fa-fw" aria-hidden="true"/>}
                                </Dropzone> :
                                <div className="form__btn" onClick={this.onSend}>Сделать картинку</div>
                            }
                        </div>
                    </div> :
                        <img style={{width: '100%'}} src={this.state.fileUrl}/>
                    }
                    <div className="note">
                        <div className="note__line"/>
                        <p className="note__text">Как побороть серость вокруг? Пожаловаться в соцсетях? Нет, этот
                            путь не для нас. Наоборот, расскажите друзьям что держит вас в колее и помогает не
                            унывать эти 7 месяцев в году.</p>
                        <div className="note__copy">Сделано с <a target="_blank"
                                                                 href="https://www.facebook.com/daniil.dntcare">אהבה</a>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
