import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Styles
import stylesContent from '../../../Styles/Components/ContentList.css';
import styles from '../../../Styles/App.css';

// Actions
import * as ActionProduct from '../../../Data/Product/action';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1,
            sortMethod: '',
            isSelect: false,
            categoryList: [],
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleProductType = this.handleProductType.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }
    componentWillMount() {
        for (let i=0; i<Object.keys(ActionProduct.categoryId2Name).length; i++) {
            this.state.categoryList.push({ value: Number(Object.keys(ActionProduct.categoryId2Name)[i]), checked: false })
        }
        setTimeout(() => {
            if (this.props.selectedCategory) {
                let newList = this.state.categoryList.slice();
                for (let i=0; i<this.props.selectedCategory.length; i++) {
                    newList.map((item, index) => {
                        if (Number(this.props.selectedCategory[i]) === Number(item.value)) {
                            item.checked = !item.checked;
                        }
                    })
                }
                this.setState({
                    categoryList: newList,
                })
            }
            this.setState({
                type: this.props.sortType,
                sortMethod: this.props.sortMethod,
            });
        }, 100);
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    handleProductType(num) {
        this.setState({
            type: num,
        })
    }
    handleCategory() {
        this.setState({
            isSelect: !this.state.isSelect,
        })
    }
    handleCategoryChange(index, e) {
        console.log(e.target.value);

        let newList = this.state.categoryList.slice();
        newList[index].checked = !newList[index].checked;
        this.setState({
            categoryList: newList,
        })
    }
    handleSort(sort) {
        this.setState({
            sortMethod: sort,
        })
    }
    handleClose() {
        let categoryList = [];

        this.state.categoryList.map((item, index) => {
            if (item.checked) {
                categoryList.push(item.value)
            }
        })
        console.log(categoryList);
        this.props.handleFilter(this.state.type, categoryList, this.state.sortMethod);
    }
    render() {
        let renderCategory = (start, end) => {
            return this.state.categoryList.map((item, index) => {
                if (item.value >= start && item.value <= end) {
                    return (
                        <div key={index} className={stylesContent.filterBtnBox}>
                            <input type={'checkbox'} id={index} value={item.value} checked={item.checked} onChange={(e) => this.handleCategoryChange(index, e)}/>
                            <label htmlFor={index}>{ActionProduct.categoryId2Name[item.value]}</label>
                        </div>
                    );
                }
            });
        }
        return (
            <div className={stylesContent.filterContainer}>
                <div>
                    {/*<div onClick={this.handleClose} className={styles.closeIcon + ' ' + stylesContent.filterClose} />*/}
                    <div className={stylesContent.filterHeader}>
                        {this.props.productType === 'fundingmarket' ? '펀딩&마켓 필터설정' : null}
                        {this.props.productType === 'video' ? '동영상 필터설정' : null}
                    </div>
                    <ul className={stylesContent.filterBody}>
                        {
                            this.props.productType === 'fundingmarket'?
                                <li className={stylesContent.filterList}>
                                    <div className={stylesContent.title}>항목</div>
                                    <div className={stylesContent.filterBox + ' ' + stylesContent.section1}>
                                        <div onClick={() => this.handleProductType(1)} className={(this.state.type === 1 ? stylesContent.filterFocus : '')}>
                                            {this.state.type === 1 ? <div className={stylesContent.redCircle} /> : <div className={stylesContent.whiteCircle} />}
                                            <div>전체</div>
                                        </div>
                                        <div onClick={() => this.handleProductType(2)} className={(this.state.type === 2 ? stylesContent.filterFocus : '')}>
                                            {this.state.type === 2 ? <div className={stylesContent.redCircle} /> : <div className={stylesContent.whiteCircle} />}
                                            <div>펀딩</div>
                                        </div>
                                        <div onClick={() => this.handleProductType(3)} className={(this.state.type === 3 ? stylesContent.filterFocus : '')}>
                                            {this.state.type === 3 ? <div className={stylesContent.redCircle} /> : <div className={stylesContent.whiteCircle} />}
                                            <div>마켓</div>
                                        </div>
                                    </div>
                                </li> : null
                        }
                        {
                            this.props.productType === 'fundingmarket' ?
                                <li className={stylesContent.filterList}>
                                    <div className={stylesContent.title}>카테고리 <span> 중복가능</span></div>
                                    <div className={stylesContent.filterBox  + ' ' + stylesContent.section2}>
                                        {renderCategory(1, 13)}
                                    </div>
                                </li> : null
                        }
                        {
                            this.props.productType === 'video' ?
                                <li className={stylesContent.filterList}>
                                    <div className={stylesContent.title}>장르 <span> 중복가능</span></div>
                                    <div className={stylesContent.filterBox  + ' ' + stylesContent.section2}>
                                        {renderCategory(100, 108)}
                                    </div>
                                </li> : null
                        }
                        {
                            this.props.productType === 'video' ?
                                <li className={stylesContent.filterList}>
                                    <div className={stylesContent.title}>인물 <span> 중복가능</span></div>
                                    <div className={stylesContent.filterBox  + ' ' + stylesContent.section2}>
                                        {renderCategory(200, 212)}
                                    </div>
                                </li> : null
                        }
                        <li className={stylesContent.filterList}>
                            <div className={stylesContent.title}>정렬순</div>
                            <div className={stylesContent.filterBox  + ' ' + stylesContent.section3}>
                                <div onClick={() => this.handleSort('date')} className={(this.state.sortMethod === 'date' ? stylesContent.filterFocus : '')}>
                                    {this.state.sortMethod === 'date' ? <div className={stylesContent.redCircle} /> : <div className={stylesContent.whiteCircle} />}
                                    <div>최신순</div>
                                </div>
                                <div onClick={() => this.handleSort('hit')} className={(this.state.sortMethod === 'hit' ? stylesContent.filterFocus : '')}>
                                    {this.state.sortMethod === 'hit' ? <div className={stylesContent.redCircle} /> : <div className={stylesContent.whiteCircle} />}
                                    <div>조회순</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <div className={stylesContent.filterClose} onClick={this.handleClose}>확인</div>
                </div>
            </div>
        );
    }
}
export default connect()(withRouter(Filter));