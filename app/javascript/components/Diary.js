import React from "react"
import PropTypes from "prop-types"

class Entry extends React.Component {
  render () {
    return (
      <div key={this.props.created_at}>
        <p>[{this.props.created_at}] {this.props.pseudo}: {this.props.content}</p>
      </div>
    );
  }
}

class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      entries: props.entries.slice(),
      pseudo: '',
      content: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePseudoChange = this.handlePseudoChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
  }

  handlePseudoChange(event) {
    this.setState({pseudo: event.target.value});
  }

  handleContentChange(event) {
    this.setState({content: event.target.value});
  }

  handleSubmit(event) {
    let pseudo = this.state.pseudo
    let content = this.state.content
    let entries = this.state.entries.slice();

    entries.push({created_at: new Date().toISOString(), pseudo, content});
    this.setState({entries, pseudo: '', content: ''})

    event.preventDefault();
    document.getElementById("pseudoInput").focus();

    fetch('./entry/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ pseudo, content })
    })
  }

  componentDidMount() {
    document.getElementById("pseudoInput").focus();
  }

  render () {
    let pseudo = this.state.pseudo
    let content = this.state.content
    return (
      <React.Fragment>
        <h1>Diary</h1>
        {this.state.entries.map((e) => <Entry key={e.created_at} created_at={e.created_at} pseudo={e.pseudo} content={e.content} />)}
      <form onSubmit={this.handleSubmit}>
        <input id="pseudoInput" type="text" value={pseudo} name="pseudo" onChange={this.handlePseudoChange}/>
        <input id="contentInput" type="text" value={content} name="content" onChange={this.handleContentChange}/>
        <input type="submit" name="Submit" />
      </form>
      </React.Fragment>
    );
  }
}

export default Diary
