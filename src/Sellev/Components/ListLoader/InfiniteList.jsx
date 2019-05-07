import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InfiniteScroll from 'react-infinite-scroller';

// Actions

// Styles
import styles from '../../Styles/App.css';

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

            listName: 'products', //db에서 나오는 출력 명
        };

        this.getList = this.getList.bind(this);
    }
    componentWillMount() {
        this.setState({
            list: [],
            from: this.props.GetParams.from || 0,
            count: this.props.GetParams.count || 20,
            isLoading: false,

            listName: this.props.listName ? this.props.listName : 'products',
        }, () => {
            this.getList();
        });
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    getList() {
        if (!this.state.isLoading && this.state.hasMore) {
            this.setState({ isLoading: true });
            this.props.GetParams.from = this.state.from;
            this.props.GetParams.count = this.state.count;
            this.props.dispatch(this.props.Get(
                this.props.GetParams,
            )).then((response) => {
                console.log(response);
                if (response.data[this.state.listName].length == 0) {
                    throw new Error('empty');
                }
                if(this.props.type === 'getUserPriority') {
                    //삭제된 유저 정보 걸러주기
                    let selleverList = response.data.users;
                    let arr = [];
                    selleverList.map((item, index) => {
                        if(item.userInfo) {
                            arr.push(item);
                        }
                    });
                    setTimeout(() => {
                        this.setState({
                            from: this.state.from + this.state.count,
                            list: [...this.state.list, ...arr],
                            isLoading: false,
                        }, () => {
                            console.log(this.state.list);
                        });
                    }, 100);
                } else {
                    this.setState({
                        from: this.state.from + this.state.count,
                        list: [...this.state.list, ...response.data[this.state.listName]],
                        isLoading: false,
                    }, () => {
                        console.log(this.state.list);
                    });
                }
            }).catch((err) => {
                console.log(err);
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
            console.log('reset호출됐습니다');
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
            <InfiniteScroll loadMore={this.getList} initialLoad={false} hasMore={this.state.hasMore} useWindow={true} isReverse={this.props.IsReverse}>
                { list }
{/*
                { this.state.isLoading ? (<img className={stylesCommon.loading} src="/jivida/assets/img/common/spinner.gif" alt="loading..." />) : null}
*/}
                { !this.state.hasMore && this.state.list.length == 0 ? (
                     this.props.EmptyText ? this.props.EmptyText : '목록이 없습니다.'
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