import { Component } from 'react';
import {cardioid} from './helpers/Helpers'

class Home extends Component {

    componentDidMount() {
        cardioid();
    }

    render() {
        return (
            <div style={{ height: '90vh' }} className="flex items-center justify-center">
                <canvas id="myCanvas">
                </canvas>
            </div>
        );
    }
}

export default Home;