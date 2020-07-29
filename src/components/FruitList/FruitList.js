import React, { Component } from 'react';
import FruitItem from '../FruitItem/FruitItem.js';
import { connect } from 'react-redux';
import axios from 'axios';

class FruitList extends Component {
    componentDidMount() {
        this.getFruit();
    }

    getFruit() {
        axios({
            method: 'GET',
            url: '/fruit'
        }).then((response) => {
            const action = { type: 'SET_BASKET', payload: response.data };
            this.props.dispatch(action);
        }).catch((error) => {
            alert('Unable to get basket from server');
        });
    }

    render() {
        return (
            <ul>
                {this.props.reduxState.basketReducer.map((basketItem) => {
                    return (
                        <FruitItem key={basketItem.id} basketItem={basketItem} />
                    );
                })}
            </ul>
        )
    }
}
// Makes our reducers available in our component
const mapReduxStateToProps = (reduxState) => ({
    reduxState
});

export default connect(mapReduxStateToProps)(FruitList);