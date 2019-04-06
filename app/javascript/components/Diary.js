import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"

class Entry extends React.Component {
  render () {
    return (
      <tr>
        <td className="entryTime text-muted">{Moment(this.props.created_at).format('hh:mm:ss')}</td>
        <td className="entryPseudo text-primary">{this.props.pseudo}:</td>
        <td className="entryContent">{this.props.content}</td>
      </tr>
    );
  }
}

const focus = (target) => document.getElementById(target).focus()

class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      entries: props.entries.slice(),
      pseudo: '',
      content: '',
      lastSpeaker: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePseudoChange = this.handlePseudoChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handlePseudoKeypress = this.handlePseudoKeypress.bind(this);
  }

  handlePseudoKeypress(event) {
    if (event.key == 'Enter') {
      event.preventDefault()
      focus('contentInput')
    }
  }

  handlePseudoChange(event) {
    this.setState({pseudo: event.target.value});
  }

  handleContentChange(event) {
    this.setState({content: event.target.value});
  }

  handleSubmit(event) {
    let pseudo = this.state.pseudo || this.state.lastSpeaker
    let content = this.state.content
    let entries = this.state.entries.slice()

    entries.push({created_at: new Date().toISOString(), pseudo, content});
    this.setState({entries, pseudo: '', content: '', lastSpeaker: pseudo})

    event.preventDefault()
    focus('pseudoInput')

    fetch(`/diary/${this.props.id}/entry/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ pseudo, content })
    })
    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  componentDidMount() {
    focus('pseudoInput')
    this.messagesEnd.scrollIntoView({ behavior: "smooth" })
  }

  render () {
    let pseudo = this.state.pseudo
    let content = this.state.content
    return (
      <React.Fragment>
        <div className="content">
          <h1>Diary</h1>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th className="text-center">
                  Time
                </th>
                <th className="text-center">
                  Pseudo
                </th>
                <th className="text-center">
                  What does the fox say?
                </th>
              </tr>
            </thead>
            <tbody>
            {this.state.entries.map((e) => <Entry key={e.created_at} created_at={e.created_at} pseudo={e.pseudo} content={e.content} />)}
            </tbody>
          </table>
          <div style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el }}></div>
        </div>

        <footer className="footer bg-secondary">
          <form onSubmit={this.handleSubmit}>
            <input id="pseudoInput" placeHolder="Who?" type="text" value={pseudo} name="pseudo" onKeyPress={this.handlePseudoKeypress} onChange={this.handlePseudoChange}/>
            <input className="w-75" placeHolder="Said what?" id="contentInput" type="text" value={content} name="content" onChange={this.handleContentChange}/>
            <input type="submit" name="Submit" />
          </form>
        </footer>

      </React.Fragment>
    );
  }
}

export default Diary
