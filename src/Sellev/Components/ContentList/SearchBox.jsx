import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Cookies from 'universal-cookie';
import Autosuggest from 'react-autosuggest';

// Actions
import * as ActionSearch from '../../Data/Search/action';

// Styles
import stylesContentList from '../../Styles/Components/ContentList.css';

const cookies = new Cookies();
class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            recentSearch: [],
            relatedSearchQueries: [],

            suggestions: [],
        }

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.getSectionSuggestions = this.getSectionSuggestions.bind(this);
        this.getSuggestionValue = this.getSuggestionValue.bind(this);
        this.renderSectionTitle = this.renderSectionTitle.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
        this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
        this.handleRecentSearch = this.handleRecentSearch.bind(this);
        this.handleDeleteRecentSearch = this.handleDeleteRecentSearch.bind(this);
    }
    componentWillMount() {
        if (cookies.get('recentSearch')) {
            console.log('cookies!!');
            console.log(cookies.get('recentSearch'));
            this.setState({
                recentSearch: cookies.get('recentSearch')
            });
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    getSectionSuggestions(section) {
        //
        return section.searchQueries;
    }
    getSuggestionValue(suggestion) {
        //
        return suggestion;
    }
    renderSectionTitle(section) {
        // title
        return (
            <strong>{section.title}</strong>
        );
    }
    close(e) {
        e.preventDefault();
        console.log('close!!!');
    }
    renderSuggestion(suggestion) {
        // searchQueries
            return (
                <div>
                    <span>{suggestion}</span>
                    <div />
                </div>
            );
    }
    onChange(e, { newValue, method }) {
        this.setState({
            value: newValue,
        })
    };
    onKeyPress(e) {
        if (e.key === 'Enter') {
            document.getElementById("myText").blur();
            this.props.handleKeyPress();
        }
    };
    onSuggestionsFetchRequested(res) {
        ActionSearch.getTopSearch({ searchQuery: res.value }).then((response) => {
            this.setState({
                relatedSearchQueries: response.data
            });
        });
    };
    onSuggestionsClearRequested() {
        this.setState({
            suggestions: []
        });
    };
    handleRecentSearch() {
        if (this.state.recentSearch.length >= 10) {
            this.setState({
                recentSearch: this.state.recentSearch.pop(),
            })
        }
        for (let i=0; i< this.state.recentSearch.length; i++) {
            if (this.state.recentSearch[i] === this.state.value) {
                this.setState({
                    recentSearch: this.state.recentSearch.splice(i, 1),
                })
            }
        }
        this.setState({
            recentSearch: [this.state.value, ...this.state.recentSearch],
        }, () => {
            cookies.set('recentSearch', this.state.recentSearch, { path: '/search' });
        });
    }
    handleDeleteRecentSearch(suggestion) {
        console.log(suggestion);
        for (let i=0;i<this.state.recentSearch.length;i++) {
            if (this.state.recentSearch[i] == suggestion) {
                this.setState({
                    recentSearch: this.state.recentSearch.splice(i, 1),
                }, () => {
                    cookies.set('recentSearch', this.state.recentSearch, { path: '/search' });
                })
            }
        }
    }
    render() {
        const { recentSearch, relatedSearchQueries, value } = this.state;
        const inputProps = {
            value,
            onChange: this.onChange,
            onKeyPress: this.onKeyPress,
            id: 'myText'
        }
        return (
            <Autosuggest
                multiSection={true}
                suggestions={[
                    {
                        title: '',
                        searchQueries: relatedSearchQueries
                    },
                    {
                        title: '검색 히스토리',
                        searchQueries: recentSearch
                    }
                ]}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                getSectionSuggestions={this.getSectionSuggestions}
                renderSectionTitle={this.renderSectionTitle}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                theme={stylesContentList}
            />
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SearchBox));