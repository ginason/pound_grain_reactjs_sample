import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import ImageList from '../ContentList/ImageList/index';

// Styles
import stylesHome from '../../Styles/Components/Home.css';
import * as ActionProduct from "../../Data/Product/action";

// Actions

class VideoBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
        }
    }
    componentWillMount() {
        let params = {
            from: 0,
            count: 12,
            sortMethod: 'hit',
            sort: 'desc',
            isFunding: false,
            isNormal: false,
            isVideo: true,
        }
        this.props.dispatch(ActionProduct.getProductList(params))
            .then((response) => {
                this.setState({
                    list: response.data.products,
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        let videoList = this.state.list ? (this.state.list.map((item, index) => {
            return (
                <div className={stylesHome.videoBox} key={index}>
                    <ImageList key={index} type={'video'} listItem={item} />
                </div>
            );
        })) : null;
        return (
            <div className={stylesHome.videoBody}>
                {videoList}
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(VideoBody));
