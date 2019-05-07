import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import stylesVideo from '../../Styles/Components/Video.css';
import styles from '../../Styles/App.css';

// Utils
import * as parseNumber from '../../Lib/Utils/parseNumber';

/*
* this.props.isSellever
* this.props.listItem
*/
class VideoListItem extends React.Component {
    constructor(props) {
        super(props);

        this.openDetail = this.openDetail.bind(this);
    }

    openDetail() {
        setTimeout(() => {
            this.props.history.push('/video/detail?productId=' + this.props.listItem.productId)
        , 100})
    }
    render() {
        return (
            <div onClick={this.openDetail} className={stylesVideo.thumbnailBox + (this.props.isSellever ? ' ' + stylesVideo.selleverVideoList : '')}>
                <div className={stylesVideo.thumbnailScaleBox}>
                <img className={stylesVideo.thumbnailScale} src={'/assets/img/img_161_thumbnail.png'} />
                <div className={stylesVideo.thumbnail} style={{ backgroundImage: 'url("' + (this.props.listItem.imageUrl ? this.props.listItem.imageUrl.replace('original', '200x200') : '/assets/img/img_default_product_200x200.png') + '")'}}></div>
                </div>
                    <div className={stylesVideo.videoListBox}>
                    <div className={stylesVideo.videoListTitle}>{this.props.listItem.title}</div>
                    <ul className={stylesVideo.videoOthers}>
                        <li className={stylesVideo.infoBox}>
                            <div className={styles.playIcon} />
                            <span>{parseNumber.numberWithCommas(this.props.listItem.hitAmount)}</span>
                        </li>
                        <li className={stylesVideo.infoBox}>
                            <span>  |  </span>
                        </li>
                        <li className={stylesVideo.infoBox}>
                            <div className={styles.likeCount} />
                            <span>{parseNumber.numberWithCommas(this.props.listItem.likeAmount)}</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(VideoListItem));