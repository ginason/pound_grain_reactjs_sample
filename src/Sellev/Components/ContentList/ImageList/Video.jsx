import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styles from '../../../Styles/Components/ImageList.css';

//Util
import * as parseNumber from '../../../Lib/Utils/parseNumber';
/*
* this.props.listItem
*/
class Video extends React.Component {
    constructor(props) {
        super(props);

        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }
    goDetail() {
        this.props.history.push('/video/detail?productId=' + this.props.listItem.productId);
    }
    goProfile() {
        this.props.history.push('/sellever?userId=' + this.props.listItem.store.userId);
    }
    render() {
        return (
            <div className={styles.videoList}>
                <div onClick={this.goDetail} className={styles.listTitle}>{this.props.listItem.title}</div>
                <div className={styles.listBody}>
                    <div onClick={this.goProfile}>{this.props.listItem.store.name}</div>
                    <span className={styles.listBar}> | </span>
                    <div className={styles.likeImg} />
                    <span>{parseNumber.numberWithCommas(this.props.listItem.likeAmount)}</span>
                </div>
            </div>
        );
    }
}
export default connect()(withRouter(Video));
