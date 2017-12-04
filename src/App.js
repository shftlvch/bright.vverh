import React, {Component} from "react";

import "./App.css";
import logo from './assets/logo.png';
import "./assets/font-awesome/css/font-awesome.css";
import $ from "jquery";
import Typed from "typed.js";
import request from "superagent";
import Dropzone from 'react-dropzone'

const CLOUDINARY_UPLOAD_PRESET = 'b9txgygb';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/vverh/upload';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: 'fa-heart',
            placeholder: 0,
            placeholders: [
                'я танцую',
                'я пою',
                'винишко и друзья',
                'прихожу в Вверх',
            ],
            fileUrl: '',
        };


        this.changeIcon = this.changeIcon.bind(this);
        this.changePlaceholder = this.changePlaceholder.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {

        let btnTimer = setInterval(this.changeIcon, 1000);
        // let placeholderTimer = setInterval(this.changePlaceholder, 1000);

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

    changePlaceholder() {
        let placeholders = this.state.placeholders,
            placeholder = placeholders.length - 1 > this.state.placeholder ? (this.state.placeholder + 1) : 0;


        this.setState({placeholder});
    }

    onDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });
        this.handleImageUpload(files[0]);
    }

    handleImageUpload(file) {
        let upload = request.post(CLOUDINARY_UPLOAD_URL)
            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== '') {
                this.setState({
                    fileUrl: response.body.secure_url
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
                {/*<div className="logo"><img src={logo}/></div>*/}
                <div className="form-wrapper" style={{backgroundColor: this.state.fileUrl ? 'rgba(229, 106, 99, .8)' : 'rgba(229, 106, 99, 1)'}}>
                    <form method="POST" className="form">
                        <header className="form__header">#мне_не_серо_когда</header>
                        <input className="form__input" placeholder={placeholder}/>
                        <Dropzone className="form__file" onDrop={this.onDrop.bind(this)} accept="image/jpeg,image/png,image/gif">
                            <i className={"fa " + icon} aria-hidden="true"/>
                            Сэлфи или картинка
                        </Dropzone>

                        {/*<input className="form__btn" type="submit" value="Отправить"/>*/}
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
