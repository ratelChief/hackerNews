import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const list = [
  {
    title:'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID:0
  },

  {
    title:'Redux',
    url:  'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points:  5,
    objectID: 1,
  }
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

// function isSearched(searchTerm) {
//   return function (item) {
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
//}

class Button extends Component {
  render () {
    const {
      onClick,
      className = '',
      children,
    } = this.props;

    return (
      <button
        onClick = {onClick}
        className = {className}
        type = "button"
      >
      {children}
      </button>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchTerm: '',
    }; //initial state

    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);//перепределяем метод класса,
    //чтобы он использовал контекст определенного экземпляра класса
}

    onDismiss(id) {
      const isNotId = item => item.objectID !==id;
      const updatedList = this.state.list.filter(isNotId);
      this.setState({list: updatedList});
    }//метод класса

    onSearchChange(evt) {
      this.setState({searchTerm: evt.target.value});
        }

  render() {
    const {searchTerm, list } = this.state;
    return (
      <div className="App">

        <Search
          value = {searchTerm}
          onChange = {this.onSearchChange}
        >
          Поиск
        </Search>
        <Table
          list = {list}
          pattern = {searchTerm}
          onDismiss = {this.onDismiss}
        />
      </div>

        // <form>
        //   <input
        //   type = "text"
        //   value={searchTerm}
        //   onChange = {this.onSearchChange}
        //   />
        // </form>
        // {list.filter(isSearched(searchTerm)).map( item  =>
        //     <div key={item.objectID}>
        //       <span>
        //         <a href = {item.url}>{item.title}</a>
        //       </span>
        //       <span>{item.author}</span>
        //       <span>{item.num_comments}</span>
        //       <span>{item.points}</span>
        //       <span>
        //         <button
        //           onClick = {() => this.onDismiss(item.objectID)}//при срабатывании обработчика,
        //           //вызывается метод класса, с контекстом конкретного экземпляра класса,
        //           //у которого сработал обработчик
        //           type = 'button'>
        //           Отбросить
        //         </button>
        //       </span>
        //     </div>
        // )}

    );
  }
}

class Search extends Component {
  render () {
    const {value, onChange, children} = this.props;
    return (
      <form>
        {children} <input
          type = "text"
          value = {value}
          onChange = {onChange}
        />
      </form>
    );
  }
}

class Table extends Component {
  render () {
    const {list, pattern, onDismiss} = this.props;
    return (
      <div>
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID}>
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
           <Button onClick={() => onDismiss(item.objectID)}>
            Отбросить
           </Button>
          </span>
        </div>
       )}
     </div>
    );
  }
}

export default App;
