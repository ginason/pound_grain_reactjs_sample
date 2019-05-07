import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Actions
import * as ActionUpload from '../../Data/FileUpload/actions';
import * as ActionAuth from '../../Data/Authentification/actions';
import * as ActionUser from '../../Data/User/actions';

// Styles
import styles from '../../Styles/App.css';
import stylesSetting from '../../Styles/Components/Setting.css';
import * as parseUrlParameter from "../../Lib/Utils/parseUrlParameter";

class SettingProfiie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            name: '',
            memo: '',

            profileUrl: '',
            profileFile: '',
            coverUrl: '',
            coverFile: '',

            warnNameNotValid: false,
        };

        this.getUser = this.getUser.bind(this);
        this.handleUploadProfileUrl = this.handleUploadProfileUrl.bind(this);
        this.handleUploadCoverUrl = this.handleUploadCoverUrl.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
        this.validationMemo = this.validationMemo.bind(this);
    }
    componentWillMount() {
        if (this.props.author && this.props.author.user) {
            this.getUser(this.props.author.user.userId)
        }

        document.addEventListener("message", (data) => {
            if (JSON.parse(data.data).type === 'profileUpload') {
                this.setState({
                    profileUrl: JSON.parse(data.data).profileUrl
                });
            }
            if (JSON.parse(data.data).type === 'coverUpload') {
                this.setState({
                    coverUrl: JSON.parse(data.data).coverUrl
                });
            }
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.author && nextProps.author.user) {
            this.getUser(nextProps.author.user.userId)
        }
    }
    getUser(userId) {
        let params = {
            userId: userId,
        }
        this.props.dispatch(ActionUser.getUserList(params))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        phoneNumber: response.data.users[0].phoneNumber,
                        memo: response.data.users[0].memo,
                        name: response.data.users[0].name,
                        profileUrl: response.data.users[0].profileUrl,
                        coverUrl: response.data.users[0].coverUrl,
                    })
                }
            });
    }
    handleUploadProfileUrl(e) {
        // 웹뷰에서는 이미지 업로드가 작동하지 않기 때문에, 앱으로 이벤트를 보내주어야 함
        window.postMessage(JSON.stringify({
            type: 'profileUpload'
        }), "*");
        
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                profileFile: file,
                profileUrl: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }

    handleUploadCoverUrl(e) {
        // 웹뷰에서는 이미지 업로드가 작동하지 않기 때문에, 앱으로 이벤트를 보내주어야 함
        window.postMessage(JSON.stringify({
            type: 'coverUpload'
        }), "*");

        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () => {
            this.setState({
                coverFile: file,
                coverUrl: reader.result,
            });
        };
        reader.readAsDataURL(file);
    }
    handleUpdateProfile() {
        this.setState({
            warnNameNotValid: false,
        })

        if (!this.state.name || this.state.name.length < 2 || this.state.name.length > 20) {
            this.setState({ warnNameNotValid: true });
        }
        setTimeout(() => {
            if (this.state.warnNameNotValid) {
                return;
            }

            let promises = [];

            if (this.state.profileFile) {
                promises.push(ActionUpload.uploadImage(this.state.profileFile)
                    .then((response) => {
                        this.setState({
                            profileUrl: response.data.original,
                        })
                        return Promise.resolve(null);
                    })
                );
            }
            if (this.state.coverFile) {
                promises.push(ActionUpload.uploadImage(this.state.coverFile)
                    .then((response) => {
                        this.setState({
                            coverUrl: response.data.original,
                        })
                        return Promise.resolve(null);
                    })
                );
            }

            setTimeout(() => {
                Promise.all(promises).then(() => {
                    let params = {
                        countryCode: 82,
                        phoneNumber: this.state.phoneNumber,
                        name: this.state.name,
                        profileUrl: this.state.profileUrl,
                        coverUrl: this.state.coverUrl,
                        type: this.props.author && this.props.author.user ? this.props.author.user.type : 0,
                        memo: this.state.memo,
                    }
                    ActionAuth.updateProfile(params)
                        .then((response) => {
                            if (response.code === 200) {
                                alert('프로필을 수정했습니다.');
                                this.setState({
                                    name: this.state.name,
                                    memo: this.state.memo
                                })
                            } else {
                                alert('프로필 수정에 실패했습니다.');
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })
            }, 100);
        }, 100);
    }
    validationMemo(e) {
        this.setState({
            memo: e.target.value,
        }, () => {
            if(this.state.memo.length > 30) {
                alert('최대 30자까지 입력할 수 있습니다.');
            }
        });

    }
    render() {
        return (
            <div className={stylesSetting.profileContainer}>
                <div className={stylesSetting.profileSection + ' ' + stylesSetting.whiteBox}>
                    <div className={stylesSetting.title}>프로필 설정</div>
                    <div className={stylesSetting.coverBox} >
                        {
                            this.state.coverUrl ?
                                <div className={stylesSetting.coverImage} style={{backgroundImage: 'url("' + this.state.coverUrl + '")'}}></div>
                                :   <div className={stylesSetting.description}>
                                    <p>커버 이미지를 등록해주세요.</p>
                                    <p>(1100x925 사이즈가 적합합니다)</p>
                                </div>
                        }
                        <div className={stylesSetting.profileBox}>
                            {
                                this.state.profileUrl ?
                                    <div className={stylesSetting.profile} style={{backgroundImage: 'url("' + this.state.profileUrl + '")'}} />
                                    : <div className={stylesSetting.profile} />

                            }
                            <label htmlFor={'uploadProfile'}><div className={styles.cameraIcon + ' ' + stylesSetting.editProfileImage} /></label>
                            <input id={'uploadProfile'} type={'file'} accept={'image/*'} className={styles.hideInput} onChange={this.handleUploadProfileUrl} onClick={this.handleUploadProfileUrl}/>
                        </div>
                        <label htmlFor={'uploadCover'}><div className={styles.cameraIcon + ' ' + stylesSetting.editCoverImage} /></label>
                        <input id={'uploadCover'} type={'file'} accept={'image/*'} className={styles.hideInput} onClick={this.handleUploadCoverUrl} onChange={this.handleUploadCoverUrl} />
                    </div>
                    <div className={styles.formGroupTitle + ' ' + stylesSetting.profileTitle}>개인정보</div>
                    <div className={styles.formGroup + ' ' + stylesSetting.formGroup}>
                        <div className={styles.formRow + ' ' + styles.formLargeText}>
                            <div className={styles.formInputText + ' ' + styles.gray}>이름</div>
                            <input className={styles.formInput + ' ' + styles.inputWithoutIcon} type={'text'} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })}/>
                        </div>
                        <div className={styles.formRow + ' ' + styles.formLargeText}>
                            <div className={styles.formInputText + ' ' + styles.grey}>휴대전화</div>
                            <div className={styles.formInput + ' ' + styles.gray + ' ' + styles.inputWithoutIcon  + ' ' + stylesSetting.cursorDefault}>{this.state.phoneNumber}</div>
                        </div>
                    </div>
                    <div className={stylesSetting.memoBox}>
                        <div className={stylesSetting.header}>한줄소개</div>
                        <div className={stylesSetting.body}>
                            <textarea className={stylesSetting.textBox} value={this.state.memo} onChange={(e) => this.validationMemo(e)} row={2} maxlength={30} />
                        </div>
                    </div>
                </div>
                {/*fullScreen*/}
                <div className={stylesSetting.btnSection + ' ' + styles.fullScreen}>
                    <div className={stylesSetting.btn + ' ' + stylesSetting.btnRed} onClick={this.handleUpdateProfile}>설정하기</div>
                </div>
                {/*mobile Screen*/}
                <div className={styles.mobileScreen}>
                    <div className={styles.mobileBtn + ' ' + stylesSetting.changePasswordBtn} onClick={this.handleUpdateProfile}>변경완료</div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SettingProfiie));