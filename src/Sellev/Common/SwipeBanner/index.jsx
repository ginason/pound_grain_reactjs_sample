import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Slider from 'react-slick';

// Components

// Styles
import styles from '../../Styles/Common/SwipeBanner.css';


/*
* this.props.listItem
* this.props.getList
*/
class SwipeBanner extends React.Component {
    render() {
        let bannerListBox = this.props.getList ? (this.props.getList.map((list, index) => {
            console.log(list);
            return this.props.listItem(list, index);
        })) : null;
        let settings = {
            arrows: true,
            dots: false,
            centerPadding: "60px",
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            infinite: true,
            swipeToSlide: true,
            className: styles[this.props.styleName],
        };
        return (
            <Slider className={styles.swipeBanner} style={styles} {...settings}>
                {bannerListBox}
            </Slider>
        );
    }
}
export default connect()(withRouter(SwipeBanner));
