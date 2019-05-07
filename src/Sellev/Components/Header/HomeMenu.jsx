import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styles from '../../Styles/Components/Header.css';
import styleApp from '../../Styles/App.css';
class globalMenu extends React.Component {
    constructor(props) {
        super(props);
        this.close = this.close.bind(this);
    }
    close() {
        this.props.close();
    }
    render() {
        return (
          <div className={styles.globalMenuContainer}>
              <div className={styles.globalMenuHeader}>
                  <div onClick={this.close} className={styleApp.closeMobile + ' ' + styles.close} />
                  {/*<div className={styles.redPoint} />*/}
                  {/*<div className={styles.menuTitle}>*/}
                      {/*Sellev<br />*/}
                      {/*New project*/}
                  {/*</div>*/}
              </div>
              <div className={styles.globalMenuBody}>
                  <ul className={styles.globalMenuList}>
                      <li><Link to={'/'}>Home</Link></li>
                      <li><Link to={'/hashtags'}>해시태그</Link></li>
                      <li><Link to={'/fundingmarket'}>펀딩&마켓</Link></li>
                      <li><Link to={'/video'}>동영상</Link></li>
                      <li><Link to={(this.props.author && this.props.author.user ? '/myhome?userId=' + this.props.author.user.userId : '/')}>마이홈</Link></li>
                  </ul>
                  <ul className={styles.othersList}>
                      <li><Link to={'/usermenu/buycoin'}>코인 충전</Link></li>
                      <li><Link to={'/usermenu/guideline'}>이용가이드</Link></li>
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
})(withRouter(globalMenu));
