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

class Policy extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={stylesSetting.deleteContainer}>
                <div className={stylesSetting.deleteSection + ' ' + stylesSetting.whiteBox}>
                    <div className={stylesSetting.title}>이용약관</div>
                    <div className={stylesSetting.regulationBox}>
                        <div className={stylesSetting.content}>
                            Version 1.1
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
})(withRouter(Policy));