import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InfiniteScroll from '../Lib/Utils/InfiniteScroll/InfiniteScroll';

// Actions
import * as ActionHouse from '../Data/House/actions';

// Styles
import stylesCommon from '../Layout/JividaLayout.css';

/*
* this.props.Reset
* this.props.Get
* this.props.GetParams
* this.props.ListItem
* this.props.IsReverse
* this.props.EmptyText
*/
class InfiniteList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],

            from: 0,
            count: 20,
            isLoading: false,
            hasMore: true,
        };
    }
    componentWillMount() {
        if (this.props.Reset) this.props.dispatch(this.props.Reset());
        this.setState({
            list: [],
            from: 0,
            isLoading: false,
            hasMore: true,
        });
        this.getList();
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    getList() {
        if (!this.state.isLoading && this.state.hasMore) {
            this.setState({ isLoading: true });
            this.props.GetParams.from = this.state.from;
            if (!this.props.GetParams.count) this.props.GetParams.count = this.state.count;
            this.props.dispatch(this.props.Get(
                this.props.GetParams,
            )).then((list) => {
                if (list.length == 0) {
                    throw new Error('empty');
                }
                this.setState({
                    from: this.state.from + this.state.count,
                    list: [...this.state.list, ...list],
                    isLoading: false,
                });
            }).catch((err) => {
                this.setState({
                    hasMore: false,
                    isLoading: false,
                });
            });
        }
    }
    reset() {
        this.setState({
            list: [],

            from: 0,
            count: 20,
            isLoading: false,
            hasMore: true,
        }, () => {
            this.getList();
        });
    }
    render() {
        let list = this.state.list.map((doc, index) => {
            return this.props.ListItem(doc, index);
        });
        if (this.props.IsReverse) {
            list = this.state.list.slice(0).reverse().map((doc, index) => {
                return this.props.ListItem(doc, index);
            });
        }
        return (
            <InfiniteScroll loadMore={this.getList.bind(this)} initialLoad={false} hasMore={this.state.hasMore} useWindow={true} isReverse={this.props.IsReverse}>
                { list }
                { this.state.isLoading ? (<img className={stylesCommon.loading} src="/jivida/assets/img/common/spinner.gif" alt="loading..." />) : null}
                { !this.state.hasMore && this.state.list.length == 0 ? (
                    <div className={stylesCommon.emptyList}>{ this.props.EmptyText ? this.props.EmptyText : '목록이 없습니다.' }</div>
                ) : null }
            </InfiniteScroll>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(InfiniteList));
