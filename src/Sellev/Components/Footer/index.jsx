import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styleFooter from '../../Styles/Components/Footer.css';
import styles from '../../Styles/App.css';
class Footer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styleFooter.footerContainer}>
                <ul className={styleFooter.footerBody}>
                    <li className={styles.fullScreen}>
                        <div className={styleFooter.footerLogo} />
                        <div className={styleFooter.itemBox}>
                            <a target={'_blank'} href={'https://www.facebook.com/sellev.asia'}><div className={styleFooter.iconFacebook} /></a>
                            <a target={'_blank'} href={'https://www.youtube.com/channel/UCFy5Cj0Z-5ruLN2kKO0aH0A'}><div className={styleFooter.iconYoutube} /></a>
                            <a target={'_blank'} href={'https://www.instagram.com/sellev.worldwide'}><div className={styleFooter.iconInstagram} /></a>
                        </div>
                    </li>
                    <li className={styles.fullScreen}>
                        <div className={styleFooter.title}>(주)로커스</div>
                        <div className={styleFooter.text}>
                            대표이사 : 김형순<br />
                            <br />
                            사업자등록번호 : 211-88-26855<br />
                            <br />
                            통신판매업 신고번호 :  제 2017-서울강남-03231호<br />
                            <br />
                            주소 : 서울특별시 강남구 도산대로 128 8층<br />
                        </div>
                    </li>
                    <li className={styleFooter.mobileSection1}>
                        <div className={styleFooter.title + ' ' + styles.fullScreen}>안내</div>
                        <div className={styleFooter.text}>
                            <Link classNmae={styles.mobileScreen} to={'/setting/policy'} target={'_blank'}>서비스 이용약관</Link>
                            <br />
                            <br />
                            <a target={'_blank'} href={'https://www.ftc.go.kr/bizCommPop.do?wrkr_no=&apv_perm_no=2017322016230203231'}>사업자 정보 확인</a><br />
                            <br />
                            <Link to={'/auth/policyprivacy'} target={'_blank'}>개인정보 취급방침</Link>
                        </div>
                    </li>
                    <li className={styles.fullScreen}>
                        <div className={styleFooter.title}>고객센터</div>
                        <div className={styleFooter.text}>
                            문의 : 02-6005-4169 (평일 11 ~ 19시)<br />
                            <br />
                            채용문의 : manage@sellev.com<br />
                            <br />
                            제휴/광고문의 : ask@sellev.com<br />
                        </div>
                    </li>
                    <li className={styleFooter.mobileSection2 + ' ' + styles.mobileScreen}>
                        <div className={styleFooter.text}>(주)로커스 | 대표이사 : 김형순</div>
                        <div className={styleFooter.text}>
                            사업자등록번호 : 211-88-26855 l 통신판매업 신고번호 :  제 2017-서울강남-03231호 | 주소 : 서울특별시 강남구 도산대로 128 8층 l 문의 : 02-6005-4169 | 이메일 : ask@sellev.com  l 개인정보담당자: 김준서
                        </div>
                    </li>
                </ul>
                <div className={styleFooter.footer}>
                    ⓒ 2017 sellev. All rights reserved
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Footer));
