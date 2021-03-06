import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
console.log(url);

const largeColumn = {
  width: '40%',
};
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};

const Button = ({onClick, className = '', children}) =>
      <button
        onClick = {onClick}
        className = {className}
        type = "button"
      >
      {children}
      </button>

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error:null,
    }; //initial state

    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);//перепределяем метод класса,
    //чтобы он использовал контекст определенного экземпляра класса
}

    needsToSearchTopStories(searchTerm) {
      return !this.state.results[searchTerm];
    }

    setSearchTopStories(result) {
      const {hits, page} = result;
      const {searchKey, results} = this.state;

      const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

      const updatedHits = [
        ...oldHits,
        ...hits
      ];

      this.setState({
        results: {
          ...results,
          [searchKey]: {hits:updatedHits, page}
        }
      });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`
        +`&${PARAM_HPP}${DEFAULT_HPP}`)
        .then(response => response.json())
        .then(result => this._isMounted && this.setSearchTopStories(result))
        .catch(error => this._isMounted && this.setState({error}));
    }

    onDismiss(id) {
      const {searchKey, results} = this.state;
      const {hits, page} = results[searchKey];

      const isNotId = item => item.objectID !== id;
      const updatedHits = hits.filter(isNotId);

      this.setState({
        results: {
          ...results,
          [searchKey]: {hits:updatedHits, page}
        }
      });
    }//метод класса

    onSearchChange(evt) {
      this.setState({searchTerm: evt.target.value});
        }

    onSearchSubmit(evt) {
      const {searchTerm} = this.state;
      this.setState({searchKey: searchTerm});
      if (this.needsToSearchTopStories(searchTerm)) {
        this.fetchSearchTopStories(searchTerm);
      }
      evt.preventDefault();
    }

    componentDidMount() {
      this._isMounted = true;

      const {searchTerm} = this.state;
      this.setState({searchKey: searchTerm});
      this.fetchSearchTopStories(searchTerm);
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

  render() {
    const {searchTerm, results, searchKey, error} = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    if(error) {
      return <p>Что-то произошло не так.</p>;
    }
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value = {searchTerm}
            onChange = {this.onSearchChange}
            onSubmit = {this.onSearchSubmit}
          >
            Поиск
          </Search>
        </div>
        {error
        ? <div className="interactions">
          <p>Somethig went wrong.</p>
        </div>
        : <Table
          list = {list}
          onDismiss = {this.onDismiss}
        />
        }
        <div className="interactions">
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page+1)}>
          Больше историй
        </Button>
      </div>
    </div>
    );
  }
}

const Search  = ({value, onChange, onSubmit, children}) =>
    <form onSubmit={onSubmit}>
      <input
        type = "text"
        value = {value}
        onChange = {onChange}
      />
      <button type="submit">
      {children}
      </button>
    </form>

const Table = ({list, onDismiss}) =>
      <div className="table">
        {list.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={midColumn}>{item.author}</span>
            <span style={smallColumn}>{item.num_comments}</span>
            <span style={smallColumn}>{item.points}</span>
            <span style={smallColumn}>
             <Button
              onClick={() => onDismiss(item.objectID)}
              className="button-inline"
             >
              Отбросить
             </Button>
            </span>
          </div>
         )}
     </div>

export default App;
