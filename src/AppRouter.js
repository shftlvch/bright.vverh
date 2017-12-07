import React, {Component} from "react";
import { Switch, Route } from 'react-router-dom';

import App from "./App";
import View from "./components/View";
import NoMatch from './components/NoMatch'

class AppRouter extends Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={App}/>
                    <Route path='/view' component={View}/>
                    <Route component={NoMatch}/>
                </Switch>
            </main>
        );
    }
}

export default AppRouter;
