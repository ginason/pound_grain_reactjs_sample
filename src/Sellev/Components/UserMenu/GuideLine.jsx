import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//Components
import ImageList from '../ContentList/ImageList/index';

// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
import styles from '../../Styles/App.css';

class GuideLine extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styleUser.guideLineContainer}>
                <div className={styleUser.guideLineHeader}>
                    <div className={styleUser.userMenuBg} />
                    <div className={styleUser.contentBox}>
                        <div className={styleUser.logoBox}>
                            <div className={styleUser.logo} />
                            <div className={styleUser.title}>이용가이드</div>
                        </div>
                        <div className={styleUser.titleBox}>
                            당신은 누구에게 열광하나요?<br />
                            팬이 모여 상상을 현실로!
                        </div>
                        <div className={styleUser.subTitleBox}>
                            셀레브 크라우드펀딩 프로젝트는<br />
                            팬들로 부터 후원금을 모아 셀럽과 팬을 위한<br />
                            특별한 경험과 상품을 만들어요.
                        </div>
                    </div>
                </div>
                <div className={styleUser.grayBgBox + ' ' + styles.fullScreen}>
                    <div className={styleUser.grayBg} />
                    <div className={styleUser.grayLine} />
                </div>
                <ul className={styleUser.guideLineBody}>
                    <li>
                        <div className={styleUser.step1Icon} />
                        <div className={styleUser.stepText}>step.1</div>
                        <div className={styleUser.stepTitle}>프로젝트 찾기</div>
                        <div className={styleUser.stepContent}>
                            좋아하는 셀럽을 찾아보세요!
                            셀레브에서 현재 진행되고 있는 다양한
                            크라우드펀딩 프로젝트를 확인해주세요.
                        </div>
                    </li>
                    <li>
                        <div className={styleUser.step2Icon} />
                        <div className={styleUser.stepText}>step.2</div>
                        <div className={styleUser.stepTitle}>알아보기</div>
                        <div className={styleUser.stepContent}>
                            눈에 쏙 들어온 프로젝트가 있다면?
                            크라우드펀딩의 상세 페이지에서 셀럽의 영상과 리워드 등 자세한 정보를
                            확인해 주세요.
                        </div>
                    </li>
                    <li>
                        <div className={styleUser.step3Icon} />
                        <div className={styleUser.stepText}>step.3</div>
                        <div className={styleUser.stepTitle}>참여하기</div>
                        <div className={styleUser.stepContent}>
                            참여하고 싶은 펀딩 프로젝트를 찾았다면? 내가 참여할 프로젝트의
                            후원금을 선택하고 참여!
                        </div>
                        <div className={styleUser.stepOther}>
                            * 프로젝트 성공 시에만 결제되는 예약결제
                            방식이니 걱정하지마세요
                            * 여러가지 프로젝트에 중복 참여가 가능합니다!
                        </div>
                    </li>
                    <li>
                        <div className={styleUser.step6Icon} />
                        <div className={styleUser.stepText}>step.6</div>
                        <div className={styleUser.stepTitle}>결과보기</div>
                        <div className={styleUser.stepContent}>
                            프로젝트의 성공/실패 결과를 확인하세요.성공했다면, 프로젝트의 진행 안내 등
                            다양한 소식들을 만나보세요.
                            실패했다면, 다른 관심 프로젝트를
                            찾아보세요!
                        </div>
                    </li>
                    <li>
                        <div className={styleUser.step5Icon} />
                        <div className={styleUser.stepText}>step.5</div>
                        <div className={styleUser.stepTitle}>달성률 도전!</div>
                        <div className={styleUser.stepContent}>
                            펀딩 프로젝트는 달성만 하면 끝?
                            목표금액 100% 달성 이후
                            또 다른 도전이 남아있습니다!
                            달성률에 따른 추가 프로젝트에
                            도전하세요!
                        </div>
                    </li>
                    <li>
                        <div className={styleUser.step4Icon} />
                        <div className={styleUser.stepText}>step.4</div>
                        <div className={styleUser.stepTitle}>소문내기</div>
                        <div className={styleUser.stepContent}>
                            SNS 공유, 친구초대 등 사람들에게
                            알려주세요!
                            프로젝트의 목표 금액을 달성하면
                            여러분의 크라우드펀딩은 성공!
                            단, 펀딩 실패 시 100% 환불!
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(GuideLine));