import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import ImageList from '../ImageList/index';
import InfiniteList from '../../ListLoader/InfiniteList';
import HashTagCard from '../HashhTagCard/index';
import SelleverCard from '../SelleverCard/index';
// Styles
import stylesContentList from '../../../Styles/Components/ContentList.css';
import stylesHashTag from '../../../Styles/Components/HashTag.css';

import * as parseUrlParameter from "../../../Lib/Utils/parseUrlParameter";

// Actions
import * as ActionHashTag from "../../../Data/HashTag/actions";
import * as ActionUser from "../../../Data/User/actions";
import * as ActionProduct from "../../../Data/Product/action";
import * as ActionAuth from "../../../Data/Authentification/actions";


/*
* this.props.styleHashTag
* this.props.styleSellever
* this.props.styleFundingMarket
* this.props.styleVideo
* */
class DetailList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showMore: false,
            displayTab: 0, // 0: All 1: Hashtag 2: Sellever 3: Product 4: Video

            relatedHashtagList: [],
            relatedSelleverList: [],
            relatedFundingMarketList: [],
            relatedVideoList: [],

            isSelleverPage: false,

            fundingmarketCount: 0,
            videoCount: 0,
            selleverCount: 0,
            hashtagCount: 0,
            paramVal: '',
            searchQuery: '',
        }

        this.handleTabComponent = this.handleTabComponent.bind(this);
        this.getRelatedHashtagList = this.getRelatedHashtagList.bind(this);
        this.getRelatedSelleverList = this.getRelatedSelleverList.bind(this);
        this.getRelatedFundingMarketList = this.getRelatedFundingMarketList.bind(this);
        this.getRelatedVideoList = this.getRelatedVideoList.bind(this);

        this.getRelatedFundingMarketCount = this.getRelatedFundingMarketCount.bind(this);
        this.getRelatedVideoCount = this.getRelatedVideoCount.bind(this);

        this.getRelatedList = this.getRelatedList.bind(this);

        this.handleSearch = this.handleSearch.bind(this);
        this.getSelleverCount = this.getSelleverCount.bind(this);
        this.getHashtagCount = this.getHashtagCount.bind(this);
    }
    componentWillMount() {
        this.getRelatedHashtagList();
        this.getRelatedSelleverList();
        this.getRelatedFundingMarketList();
        this.getRelatedVideoList();

        this.getRelatedList(this.props.location.search);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search) {
            this.getRelatedList(nextProps.location.search);
            return true;
        }

        if (nextState !== this.state) {
            return true;
        }

        return false;
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    getRelatedList(search) {
        let urlParams = parseUrlParameter.parse(search);
        this.setState({
            relatedHashtagList: [],
            relatedSelleverList: [],
            relatedFundingMarketList: [],
            relatedVideoList: [],
        });
        if (this.props.location.pathname === '/search') {
            this.setState({
                searchQuery: undefined,
            })
        }
        setTimeout(() => {
            if (this.hashtagList) this.hashtagList.reset();
            if (this.selleverList) this.selleverList.reset();
            if (this.fundingmarketList) this.fundingmarketList.reset();
            if (this.videoList) this.videoList.reset();

            this.getRelatedHashtagList();
            this.getRelatedSelleverList();
            this.getRelatedFundingMarketList();
            this.getRelatedVideoList();

            // this.getRelatedFundingMarketCount();
            // this.getRelatedVideoCount();
        }, 100);
    }
    handleTabComponent(index) {
        this.setState({
            displayTab: index,
        })
    }
    getRelatedHashtagList() {
        let params = {
            from: 0,
            count: 9,
            sort: 'desc',
        }
        if (this.props.paramName) {
            params[this.props.paramName] =  this.props.paramVal ? this.props.paramVal : '';
        }
        if (this.state.searchQuery) {
            params['searchQuery'] = this.state.searchQuery;
        }
        setTimeout(() => {
            this.props.dispatch(ActionHashTag.getHashTagList(params))
                .then((response) => {
                    console.log("hashtag");
                    console.log(response);
                    console.log("hashtag");
                    if (response.code === 200) {
                        this.setState({
                            relatedHashtagList: response.data.hashtags,
                        })
                        this.getHashtagCount(params);
                    }
                })
        }, 100);
    }
    getHashtagCount(params) {
        this.props.dispatch(ActionHashTag.getHashTagCount(params))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        hashtagCount: response.data.count,
                    })
                }
            })
    }
    getRelatedSelleverList() {
        let params = {
            from: 0,
            count: 9,
            type: 2,
        }
        if (this.props.paramName) {
            params[this.props.paramName] =  this.props.paramVal ? this.props.paramVal : '';
        }
        if (this.state.searchQuery) {
            params['searchQuery'] = this.state.searchQuery;
        }
        console.log('sellever list!!');
        if (this.props.paramName === 'userId') {
            this.props.dispatch(ActionUser.getUserPriority(params))
                .then((response) => {
                    if (response.code === 200) {
                        console.log("Sellever");
                        console.log(response);
                        console.log("Sellever");
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
                                relatedSelleverList: arr,
                            });
                        }, 100);
                        this.getSelleverCount('userId', params.userId, params);
                    }
                })
        } else if(this.props.paramName === 'hashtagId'){
            this.props.dispatch(ActionUser.getUserList(params))
                .then((response) => {
                    if (response.code === 200) {
                        console.log('priority!! hashtagId');
                        console.log(params);
                        console.log(response);
                        this.setState({
                            relatedSelleverList: response.data.users,
                        })
                        this.getSelleverCount('hashtagId', params.hashtagId, params);
                    }
                })
        } else {
            console.log(params);
            this.props.dispatch(ActionUser.getUserList(params))
                .then((response) => {
                    if (response.code === 200) {
                        console.log('priority!!');
                        console.log(params);
                        console.log(response);
                        this.setState({
                            relatedSelleverList: response.data.users,
                        })
                        this.getSelleverCount('', '', params);
                    }
                })
        }
    }
    getSelleverCount(idName, userId, param) {
        if(idName === 'userId'){
            let params={
                userId: userId,
                type: 2,
            }
            this.props.dispatch(ActionUser.getUserPriorityCount(params))
                .then((response) => {
                    if (response.code === 200) {
                        this.setState({
                            selleverCount: response.data.count,
                        })
                    }
                })
        } else if(idName === 'hashtagId'){
            let params={
                hashtagId: userId,
                type: 2,
            }
            this.props.dispatch(ActionUser.getUserCount(params))
                .then((response) => {
                    if (response.code === 200) {
                        this.setState({
                            selleverCount: response.data.count,
                        })
                    }
                })
        } else {
            this.props.dispatch(ActionUser.getUserCount(param))
                .then((response) => {
                    if (response.code === 200) {
                        this.setState({
                            selleverCount: response.data.count,
                        })
                    }
                })
        }
    }
    getRelatedFundingMarketList() {
        let params = {
            from: 0,
            count: 4,
            sortMethod: 'date',
            sort: 'desc',
            isNormal: true,
            isFunding: true,
            isVideo: false,
        }

        if (this.props.paramName) {
            params[this.props.paramName] =  this.props.paramVal ? this.props.paramVal : '';
        }
        if (this.state.searchQuery) {
            params['searchQuery'] = this.state.searchQuery;
        }
        this.props.dispatch(ActionProduct.getProductList(params))
            .then((response) => {
                console.log("FundingMarket");
                console.log(response);
                console.log("FundingMarket");
                this.setState({
                    relatedFundingMarketList: response.data.products,
                })
                this.getRelatedFundingMarketCount(params);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getRelatedFundingMarketCount(params) {
        this.props.dispatch(ActionProduct.getProductListCount(params))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        fundingmarketCount: response.data.count,
                    })
                }
            })
    }
    getRelatedVideoList() {
        let params = {
            from: 0,
            count: 4,
            isVideo: true,
            isNormal: false,
            isFunding: false,
        }
        if (this.props.paramName) {
            params[this.props.paramName] =  this.props.paramVal ? this.props.paramVal : '';
        }
        if (this.state.searchQuery) {
            params['searchQuery'] = this.state.searchQuery;
        }

        this.props.dispatch(ActionProduct.getProductList(params))
            .then((response) => {
                console.log("video");
                console.log(response);
                console.log("video");
                this.setState({
                    relatedVideoList: response.data.products,
                })
                this.getRelatedVideoCount(params);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    getRelatedVideoCount(params) {
        this.props.dispatch(ActionProduct.getProductListCount(params))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        videoCount: response.data.count,
                    })
                }
            })
    }
    handleSearch(searchQuery) {
        this.setState({
            relatedHashtagList: [],
            relatedSelleverList: [],
            relatedFundingMarketList: [],
            relatedVideoList: [],
            searchQuery: searchQuery,
        }, () => {
            if (this.hashtagList) this.hashtagList.reset();
            if (this.selleverList) this.selleverList.reset();
            if (this.fundingmarketList) this.fundingmarketList.reset();
            if (this.videoList) this.videoList.reset();

            this.getRelatedHashtagList();
            this.getRelatedSelleverList();
            this.getRelatedFundingMarketList();
            this.getRelatedVideoList();
        });
    }
    render() {
        let hashtagList = (item, index) => {
            return (
                <HashTagCard key={index} itemList={item} />
            );
        }
        let selleverList = (item, index) => {
            if(item.userInfo) {
                return (
                    <SelleverCard key={index} num={index} itemList={item.userInfo} />
                );
            } else {
                return (
                <SelleverCard key={index} num={index} itemList={item} />
                );
            }
        }
        let fundingMarketList = (item, index) => {
            return (
                <div key={index} className={stylesContentList.productBox}>
                    <ImageList type={'fundingmarket'} listItem={item} />
                </div>
            );
        }
        let videoList = (item, index) => {
            return (
                <div className={stylesContentList.videoBox} key={index}>
                    <ImageList type={'video'} listItem={item} />
                </div>
            );
        }
        let relatedHashtagList = () => { // 탭이 ALL일때 보여주는 해시태그 리스트
            return (
                <div className={stylesContentList.relatedHashTagSection + (this.props.styleHashTag ? ' ' + this.props.styleHashTag : '' )}>
                    <div className={stylesContentList.detailSectionTitle}>
                        <div className={stylesContentList.title}>추천 해시태그</div>
                        {this.state.relatedHashtagList && this.state.relatedHashtagList.length > 0  && this.state.searchQuery !== undefined  ?
                            (this.state.hashtagCount > 6 ? <div onClick={() => this.handleTabComponent(3)} className={stylesContentList.viewAll}>전체보기</div> : null)
                            :
                            null
                        }
                    </div>
                    <div className={stylesContentList.content}>
                        {this.state.relatedHashtagList && this.state.relatedHashtagList.length > 0 && this.state.searchQuery !== undefined ? (this.state.relatedHashtagList.map((item, index) => {
                            if(index < 6) {
                                return hashtagList(item, index)
                            }
                            })) :
                            emptyList
                        }
                    </div>
                </div>
            );
        }
        let relatedSelleverList = () => { // 탭이 ALL일때 보여주는 셀레버 리스트
            return (
                <div className={stylesContentList.relatedSelleverSection + (this.props.styleSellever ? ' ' + this.props.styleSellever : '' )}>
                    <div className={stylesContentList.detailSectionTitle}>
                        <div className={stylesContentList.title}>추천 셀레버</div>
                        {this.state.relatedSelleverList && this.state.relatedSelleverList.length > 0  && this.state.searchQuery !== undefined  ?
                            (this.state.selleverCount > 8 ? <div onClick={() => this.handleTabComponent(4)}
                                                                      className={stylesContentList.viewAll}>전체보기</div> : null)
                            :
                            null
                        }
                    </div>
                    <div className={stylesContentList.content + ' ' + stylesContentList.selleverBanner}>
                        {this.state.relatedSelleverList && this.state.relatedSelleverList.length > 0  && this.state.searchQuery !== undefined  ? (this.state.relatedSelleverList.map((item, index) => {
                                if(index < 8) {
                                    return selleverList(item, index);
                                }
                            })) :
                            emptyList
                        }
                    </div>
                </div>
            )
        }
        let relatedFundingMarketList = () => { // 탭이 ALL일때 보여주는 펀딩마켓 리스트
            return (
                <div className={stylesContentList.fundingMarketSection + (this.props.styleFundingMarket ? ' ' + this.props.styleFundingMarket : '' )}>
                    <div className={stylesContentList.detailSectionTitle}>
                        <div className={stylesContentList.title}>추천 펀딩&마켓</div>
                        {this.state.relatedFundingMarketList && this.state.relatedFundingMarketList.length > 0  && this.state.searchQuery !== undefined  ?
                            (this.state.fundingmarketCount > 4 ? <div onClick={() => this.handleTabComponent(2)}
                                                                      className={stylesContentList.viewAll}>전체보기</div> : null)
                            :
                            null
                        }
                    </div>
                    <div className={stylesContentList.productBody}>
                        {this.state.relatedFundingMarketList && this.state.relatedFundingMarketList.length > 0  && this.state.searchQuery !== undefined  ? (this.state.relatedFundingMarketList.map((item, index) => {
                                return fundingMarketList(item, index);
                            })) :
                            emptyList
                        }
                    </div>
                </div>
            );
        }
        let relatedVideoList = () => { // 탭이 ALL일때 보여주는 비디오 리스트
            return (
                <div className={stylesContentList.videoSection + (this.props.styleVideo ? ' ' + this.props.styleVideo : '' )}>
                    <div className={stylesContentList.detailSectionTitle}>
                        <div className={stylesContentList.title}>추천 동영상</div>
                        {this.state.relatedVideoList && this.state.relatedVideoList.length > 0  && this.state.searchQuery !== undefined  ?
                            (this.state.videoCount > 4 ? <div onClick={() => this.handleTabComponent(1)} className={stylesContentList.viewAll}>전체보기</div> : null)
                        :
                            null
                        }
                    </div>
                    <div className={stylesContentList.videoBody}>
                        {this.state.relatedVideoList && this.state.relatedVideoList.length > 0  && this.state.searchQuery !== undefined  ? (this.state.relatedVideoList.map((item, index) => {
                                return videoList(item, index);
                            })) :
                            emptyList
                        }
                    </div>
                </div>
            );
        }
        let emptyList = (
            <div className={stylesContentList.defaultBox}>
                <div className={stylesContentList.name}>불러올 목록이 없습니다.</div>
            </div>
        )
        return (
            <div className={stylesContentList.detailList}>
                <div className={stylesContentList.detailTab}>
                    <div className={stylesContentList.tabItem + (this.state.displayTab === 0 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(0)}>ALL</div>
                    <div className={stylesContentList.tabItem + (this.state.displayTab === 1 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(1)}>동영상</div>
                    <div className={stylesContentList.tabItem + (this.state.displayTab === 2 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(2)}>펀딩&마켓</div>
                    <div className={stylesContentList.tabItem + (this.state.displayTab === 3 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(3)}>해시태그</div>
                    <div className={stylesContentList.tabItem + (this.state.displayTab === 4 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(4)}>셀레버</div>
                </div>
                { this.state.displayTab === 0 ?
                    <div>
                        {relatedVideoList()}
                        {relatedFundingMarketList()}
                        {relatedHashtagList()}
                        {relatedSelleverList()}
                    </div>
                    : null }
                { this.state.displayTab === 3 ?
                    <div className={stylesContentList.relatedHashTagSection + (this.props.styleHashTag ? ' ' + this.props.styleHashTag : '' )}>
                        <div className={stylesContentList.detailSectionTitle}>
                            <div className={stylesContentList.title}>해시태그</div>
                        </div>
                        <div className={stylesContentList.content}>
                            {
                                this.state.searchQuery === undefined ? emptyList :
                                    <InfiniteList onRef={(ref) => this.hashtagList = ref} ListItem={hashtagList} listName={'hashtags'} EmptyText={emptyList} Get={ActionHashTag.getHashTagList}
                                                  GetParams={{
                                                      sort: 'desc',
                                                      searchQuery: this.state.searchQuery,
                                                      userId: this.props.paramName === 'userId' && this.props.paramVal ? this.props.paramVal : '',
                                                      hashtagId: this.props.paramName === 'hashtagId' && this.props.paramVal ? this.props.paramVal : '',
                                                  }} />

                            }
                        </div>
                    </div> : null }
                { this.state.displayTab === 4 ?
                    <div className={stylesContentList.relatedSelleverSection + (this.props.styleSellever ? ' ' + this.props.styleSellever : '' )}>
                        <div className={stylesContentList.detailSectionTitle}>
                            <div className={stylesContentList.title}>셀레버</div>
                        </div>
                        <div className={stylesContentList.content + ' ' + stylesContentList.selleverBanner}>
                            {
                                this.state.searchQuery === undefined ? emptyList :
                                    <InfiniteList onRef={(ref) => this.selleverList = ref} ListItem={selleverList} listName={'users'} EmptyText={emptyList} type={'getUserPriority'} Get={this.props.paramName === 'userId' ? ActionUser.getUserPriority : ActionUser.getUserList}
                                                  GetParams={{
                                                      type: 2,
                                                      sort: 'desc',
                                                      searchQuery: this.state.searchQuery,
                                                      userId: this.props.paramName === 'userId' && this.props.paramVal ? this.props.paramVal : '',
                                                      hashtagId: this.props.paramName === 'hashtagId' && this.props.paramVal ? this.props.paramVal : '',
                                                  }} />
                            }
                        </div>
                    </div> : null }
                { this.state.displayTab === 2 ?
                    <div className={stylesContentList.fundingMarketSection + (this.props.styleFundingMarket ? ' ' + this.props.styleFundingMarket : '' )}>
                        <div className={stylesContentList.detailSectionTitle}>
                            <div className={stylesContentList.title}>펀딩&마켓</div>
                        </div>
                        <div className={stylesContentList.productBody}>
                            {
                                this.state.searchQuery === undefined ? emptyList :
                                    <InfiniteList onRef={(ref) => this.fundingmarketList = ref}
                                                  ListItem={fundingMarketList} EmptyText={emptyList}
                                                  Get={ActionProduct.getProductList} hasMore={true}
                                                  GetParams={{
                                                      sortMethod: 'date',
                                                      sort: 'desc',
                                                      isNormal: true,
                                                      isFunding: true,
                                                      isVideo: false,
                                                      searchQuery: this.state.searchQuery,
                                                      userId: this.props.paramName === 'userId' && this.props.paramVal ? this.props.paramVal : '',
                                                      hashtagId: this.props.paramName === 'hashtagId' && this.props.paramVal ? this.props.paramVal : '',
                                                  }}/>
                            }
                        </div>
                    </div> : null }
                { this.state.displayTab === 1 ?
                    <div className={stylesContentList.videoSection + (this.props.styleVideo ? ' ' + this.props.styleVideo : '' )}>
                        <div className={stylesContentList.detailSectionTitle}>
                            <div className={stylesContentList.title}>동영상</div>
                        </div>
                        <div className={stylesContentList.videoBody}>
                            {
                                this.state.searchQuery === undefined ? emptyList :
                                    <InfiniteList onRef={(ref) => this.videoList = ref} ListItem={videoList} EmptyText={emptyList} Get={ActionProduct.getProductList} hasMore={true}
                                                  GetParams={{
                                                      sortMethod: 'date',
                                                      sort: 'desc',
                                                      isFunding: false,
                                                      isNormal: false,
                                                      isVideo: true,
                                                      searchQuery: this.state.searchQuery,
                                                      userId: this.props.paramName === 'userId' && this.props.paramVal ? this.props.paramVal : '',
                                                      hashtagId: this.props.paramName === 'hashtagId' && this.props.paramVal ? this.props.paramVal : '',
                                                  }} />
                            }
                        </div>
                    </div> : null }
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(DetailList));