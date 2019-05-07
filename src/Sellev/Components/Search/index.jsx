import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookies from 'universal-cookie';

// Components
import DetailList from '../ContentList/DetailList/index';
import SearchBox from '../ContentList/SearchBox';

// Actions

// Styles
import stylesSearch from '../../Styles/Components/Search.css';

const cookies = new Cookies();
class SearchHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            recentSearch: [],
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchKeyPress = this.handleSearchKeyPress.bind(this);
    }

    handleSearch() {
        if (this.searchBox.state.value) {
            this.searchBox.handleRecentSearch();
            setTimeout(() => {
                this.detailList.handleSearch(this.searchBox.state.value.trim());
            }, 100)
        } else {
            alert('검색어를 입력해주세요.');
        }
    }

    handleSearchKeyPress() {
        this.handleSearch();
    }

    render() {
        return (
            <div className={stylesSearch.searchContainer}>
                <div className={stylesSearch.searchBarContainer}>
                    <div className={stylesSearch.searchBar}>
                        <SearchBox onRef={(ref) => this.searchBox = ref} handleKeyPress={this.handleSearchKeyPress} />
                    </div>
                    <div className={stylesSearch.border} />
                    <div onClick={this.handleSearch} className={stylesSearch.searchBox}>
                        <div className={stylesSearch.searchMobile} />
                    </div>
                </div>
                <DetailList onRef={(ref) => this.detailList = ref} searchQuery={this.state.searchQuery} preventLoad={true} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SearchHome));