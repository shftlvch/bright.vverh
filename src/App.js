import React, {Component} from "react";

import "./App.css";
import "./assets/font-awesome/css/font-awesome.css";
import $ from "jquery";
import Typed from "typed.js";

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
            ]
        };


        this.changeIcon = this.changeIcon.bind(this);
        this.changePlaceholder = this.changePlaceholder.bind(this);
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

    render() {
        let state = this.state,
            icon = state.icon,
            placeholder = state.placeholders[state.placeholder];
        return (
            <div>
                <div className="form-wrapper">
                    <form method="POST" encType="multipart/form-data" className="form">

                        <header className="form__header">#мне_не_серо_когда</header>
                        <input className="form__input" placeholder={placeholder}/>
                        <input className="form__file" type="file" name="img" accept="image/jpeg,image/png,image/gif"/>
                        <label className="form__file-label" htmlFor="form__file"><i className={"fa " + icon}
                                                                                    aria-hidden="true"></i>Сэлфи или
                            картинка</label>
                        {/*<input className="form__btn" type="submit" value="Отправить"/>*/}
                    </form>
                </div>
            </div>
        );
    }
}

export default App;
