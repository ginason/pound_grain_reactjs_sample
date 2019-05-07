import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import stylesSetting from '../../Styles/Components/Setting.css';

class Privacy extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={stylesSetting.deleteContainer + (this.props.author ? '' : ' ' + stylesSetting.positionInMid)}>
                <div className={stylesSetting.deleteSection + ' ' + stylesSetting.whiteBox}>
                    <div className={stylesSetting.title}>개인정보취급방침</div>
                    <div className={stylesSetting.regulationBox}>
                        <div className={stylesSetting.content}>
                            <h3 dir="ltr"><strong>개인정보취급방침</strong></h3>
                            <br />
                            <p dir="ltr">㈜셀레브(이하 &lsquo;회사&rsquo;라 함)가 운영하는 인터넷사이트(&lsquo;sellev.com&rsquo;)에서 &lsquo;셀레브 크라우드펀딩과 전자상거래 서비스(이하 &lsquo;서비스&rsquo;라 함)를 제공함에 있어, 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.   &lsquo;회사&rsquo;는 개인정보처리방침을 개정하는 경우 사이트의 공지사항에 기재하거나 각 회원에 대해 개별적으로 공지하는 등의 방식으로 회원들에게 이를 공지할 것입니다.  ○ 본 방침은 2018년 4월 3일부터 시행됩니다.</p>
                            <p><strong>1. 개인정보의 처리 목적</strong></p>

                            <p>회사는 사이트를 운영함에 있어 개인정보를 다음의 목적을 위해 처리합니다. 처리한 개인정보는 다음의 목적이외의 용도로는 사용되지 않으며 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.</p>

                            <p className={stylesSetting.indent}>가. 홈페이지 회원가입 및 관리 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별&middot;인증, 회원자격 유지&middot;관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지&middot;통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.</p>

                            <p className={stylesSetting.indent}>나. 민원사무 처리 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락&middot;통지, 처리결과 통보 등을 목적으로 개인정보를 처리합니다</p>

                            <p className={stylesSetting.indent}>다. 재화 또는 서비스 제공 서비스 제공, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 요금결제&middot;정산, 채권추심 등을 목적으로 개인정보를 처리합니다.</p>

                            <p className={stylesSetting.indent}>라. 마케팅 및 광고에의 활용 신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 , 인구통계학적 특성에 따른 서비스 제공 및 광고 게재 , 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>2. 개인정보 파일 현황</strong></p>

                            <p>회사는 수집된 회원의 개인정보를 다음의 목적을 위해 사용하고 있습니다.</p>

                            <p>개인정보 파일</p>

                            <ol>
                                <li className={stylesSetting.indent}>1. 법인회원 : 법인명칭, 대표자 성명, 사업자등록번호, 법인등록번호, 담당자 성명, 담당부서, 전화번호, 이메일 주소, 휴대전화번호, 비밀번호 질문과 답, 비밀번호, 로그인ID, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 은행계좌정보, 결제기록</li>
                                <br />
                                <li className={stylesSetting.indent}>2. 개인회원 : 기업명, 사업자등록번호, 회원 성명, 생년월일, 자택전화번호, 기업전화번호, 이메일 주소, 휴대전화번호, 비밀번호 질문과 답, 비밀번호, 로그인ID, 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 결제기록</li>
                            </ol>
                            <br />
                            <p>- 수집방법 : 홈페이지</p>

                            <p><strong>3. 개인정보의 보유 및 이용기간</strong></p>

                            <ol>
                                <li className={stylesSetting.indent}>1. 회사는 원칙적으로 회원의 개인정보를 수집한 때로부터 개인정보 수집 및 이용에 관한 동의 목적을 달성할 때까지 기간 동안에 한하여 개인정보를 보유 및 이용하며, 개인정보 수집 및 이용목적이 달성된 경우에는 해당 정보를 지체 없이 파기합니다.</li>
                                <br />
                                <li className={stylesSetting.indent}>2. 단, 상법 등 관계법령의 규정에 의하여 보존할 의무가 있는 경우 회사는 회원의 개인정보를 보관합니다. 이 경우 회사는 보관하는 정보를 그 보관의 목적으로만 이용하며 보존기간은 다음과 같습니다.
                                    <br />
                                    <ol>
                                        <li className={stylesSetting.indentDouble}>1. 신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년 (신용정보의 이용 및 보호에 관한 법률)</li>
                                        <br />
                                        <li className={stylesSetting.indentDouble}>2. 소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                                        <br />
                                        <li className={stylesSetting.indentDouble}>3. 대금결제 및 재화 등의 공급에 관한 기록 : 5년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                                        <br />
                                        <li className={stylesSetting.indentDouble}>4. 계약 또는 청약철회 등에 관한 기록 : 5년 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                                        <br />
                                        <li className={stylesSetting.indentDouble}>5. 표시/광고에 관한 기록 : 6개월 (전자상거래등에서의 소비자보호에 관한 법률)</li>
                                    </ol>
                                </li>
                            </ol>
                            <br />
                            <p><strong>4. 개인정보의 제3자 제공에 관한 사항</strong></p>

                            <p className={stylesSetting.indent}>(1) 회사는 회원의 개인정보를 &ldquo;개인정보의 수집&middot;이용&rdquo;에서 고지한 범위 내에서 사용하며,회원의 사전 동의 없이 동 범위를 초과하여 이용하거나 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 이래의 경우에는 예외로 합니다.</p>

                            <p className={stylesSetting.indentDouble}>가. 정보주체인 회원이 사전에 공개 또는 제3자 제공에 동의한 경우</p>

                            <p className={stylesSetting.indentDouble}>나. 법령의 규정에 의거하거나, 수사, 조사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관 및 감독당국의 요구가 있는 경우</p>

                            <p className={stylesSetting.indentDouble}>다. 요금 정산을 위하여 필요한 경우</p>

                            <p className={stylesSetting.indent}>2) 그 밖에 개인정보 제3자 제공이 필요한 경우에는 회원의 동의를 얻는 등 적법한 절차를 통하여 제3자에게 개인정보를 제공할 수 있습니다. 회사는 회원들의 거래 이행을 위하여 필요한 경우 회원들의 동의를 얻는 등 적법한 절차를 통하여 아래와 같이 개인정보를 제공할 수 있습니다.</p>

                            <p className={stylesSetting.indentDouble}>가. 공유 받는 자 : 셀레버 및 발행자, 바이어</p>

                            <p className={stylesSetting.indentDouble}>나. 공유하는 항목:  ① 특정 펀딩 참여자 간의 정보(이메일, 성명, 휴대폰번호, 전화번호) ② 펀딩성공, 취소, 교환 등 정보  ③ 펀딩 참여정보</p>

                            <p className={stylesSetting.indentDouble}>다. 공유 받는 자의 이용목적: 펀딩성패 내용확인, 취소, 환불, 추후 펀딩참여, 고객상담 등 정보통신서비스제공계약 및 전자상거래 계약의 이행을 위해 필요한 업무처리목적</p>

                            <p className={stylesSetting.indentDouble}>라. 보유 및 이용 기간 : 서비스 제공완료 3개월 내 삭제</p>

                            <p className={stylesSetting.indent}>(3) 회원은 개인정보의 제3자 제공에 대하여 동의를 하지 않을 수 있고, 언제든지 제3자 제공 동의를 철회할 수 있습니다. 동의를 거부하시는 경우에도 회원가입서비스는 이용 하실 수 있으나, 제3자 제공에 기반한 관련 서비스의 이용 및 제공이 제한될 수 있습니다. 기타 개인정보 제3자 제공에 대한 변동사항은 공지 및 별도 통지를 할 예정입니다.</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>5. 정보주체의 권리,의무 및 그 행사방법</strong></p>

                            <p>사이트의 회원은 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>

                            <p className={stylesSetting.indent}>① 정보주체로서 사이트의 회원은 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</p>

                            <p className={stylesSetting.indentDouble}>1. 개인정보 열람요구</p>

                            <p className={stylesSetting.indentDouble}>2. 오류 등이 있을 경우 정정 요구</p>

                            <p className={stylesSetting.indentDouble}>3. 삭제요구</p>

                            <p className={stylesSetting.indentDouble}>4. 처리정지 요구</p>

                            <p className={stylesSetting.indent}>② 제1항에 따른 권리 행사는 회사에 대해 개인정보 보호법 시행규칙 별지 제8호 서식에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 사이트를 통해 이에 대해 지체 없이 조치하겠습니다.</p>

                            <p className={stylesSetting.indent}>③ 정보주체인 회원이 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 사이트는 이에 대한 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.</p>

                            <p className={stylesSetting.indent}>④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 개인정보 보호법 시행규칙 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>6. 개인정보의 파기</strong></p>

                            <p>회사는 원칙적으로 개인정보 처리목적이 달성된 경우에는 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다.</p>

                            <p className={stylesSetting.indent}>(1) 파기절차이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.</p>

                            <p className={stylesSetting.indent}>(2) 파기기한이용자의 개인정보는 개인정보의 보유기간이 경과된 경우에는 보유기간의 종료일로부터 5일 이내에, 개인정보의 처리 목적 달성, 해당 서비스의 폐지, 사업의 종료 등 그 개인정보가 불필요하게 되었을 때에는 개인정보의 처리가 불필요한 것으로 인정되는 날로부터 5일 이내에 그 개인정보를 파기합니다.</p>

                            <p className={stylesSetting.indent}>(3) 파기방법 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>7. 개인정보의 안전성 확보 조치</strong></p>

                            <p>회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(1) 정기적인 자체 감사 실시개인정보 취급 관련 안정성 확보를 위해 정기적(분기 1회)으로 자체 감사를 실시하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(2) 개인정보 취급 직원의 최소화 및 교육개인정보를 취급하는 직원을 지정하고 담당자에 한정시켜 최소화 하여 개인정보를 관리하는 대책을 시행하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(3) 내부관리계획의 수립 및 시행 개인정보의 안전한 처리를 위하여 내부관리계획을 수립하고 시행하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(4) 해킹 등에 대비한 기술적 대책 회사는 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신&middot;점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(5) 개인정보의 암호화 이용자인 회원의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 중요한 데이터는 파일 및 전송 데이터를 암호화 하거나 파일 잠금 기능을 사용하는 등의 별도 보안기능을 사용하고 있습니다.</p>

                            <p className={stylesSetting.indent}>6) 접속기록의 보관 및 위변조 방지 개인정보처리시스템에 접속한 기록을 최소 6개월 이상 보관, 관리하고 있으며, 접속 기록이 위변조 및 도난, 분실되지 않도록 보안기능 사용하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(7) 개인정보에 대한 접근 제한 개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여,변경,말소를 통하여 개인정보에 대한 접근통제를 위하여 필요한 조치를 하고 있으며 침입차단시스템을 이용하여 외부로부터의 무단 접근을 통제하고 있습니다.</p>

                            <p className={stylesSetting.indent}>(8) 문서보안을 위한 잠금장치 사용 개인정보가 포함된 서류, 보조저장매체 등을 잠금장치가 있는 안전한 장소에 보관하고 있습니다.</p>

                            <p>&nbsp; &nbsp; &nbsp; &nbsp; (9) 비인가자에 대한 출입 통제개인정보를 보관하고 있는 물리적 보관 장소를 별도로 두고 이에 대해 출입통제 절차를 수립, 운영하고 있습니다.</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>8. 개인정보 보호책임자 작성</strong></p>

                            <p className={stylesSetting.indent}>(1) 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.  ▶ 개인정보 보호책임자 성명: 김준서 직책: 팀장 연락처: 02-6005-4169 ※ 개인정보 보호 담당부서로 연결됩니다  ▶ 개인정보 보호 담당부서 부서명: 사업지원팀 담당자: 김준서 연락처: 02-6005-4169</p>

                            <p className={stylesSetting.indent}>(2) 정보 주체인 사이트 회원은 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.</p>

                            <p>
                                <br />
                            </p>

                            <p><strong>9. 개인정보 처리방침 변경</strong></p>

                            <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Privacy));