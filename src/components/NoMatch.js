import React, {Component} from "react";
//import './App.css'

class NoMatch extends Component {
    componentWillMount() {
        const {staticContext} = this.props;
        if (staticContext) {
            staticContext.code = 404;
            staticContext.head.title = 'HELLO';
        }
    }

    render() {
        return (
            <div>
                Sorry, page not found
            </div>
        )
    }
}

export default NoMatch

