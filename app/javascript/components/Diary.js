import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"

class Entry {
  constructor(body) {
    this.id = body.id
    this.pseudo = body.pseudo
    this.content = body.content
    this.created_at = body.created_at
  }
}

class EntryView extends React.Component {
  render () {
    return (
      <tr>
        <td className="entryTime text-muted col-xs-1">{Moment(this.props.entry.created_at).format('HH:mm:ss')}</td>
        <td className="entryPseudo text-primary col-xs-2">{this.props.entry.pseudo}:</td>
        <td className="entryContent col-xl-3">{this.props.entry.content}</td>
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
      document.getElementById('contentInput').focus()
    }
  }

  handlePseudoChange(event) { this.setState({pseudo: event.target.value}); }
  handleContentChange(event) { this.setState({content: event.target.value}); }

  addEntry(body) {
    let entries = this.state.entries.slice()
    let entry = new Entry(body)
    entries.push(entry)
    this.setState({entries, pseudo: '', content: '', lastSpeaker: entry.pseudo})
    window.setTimeout(() => document.getElementById("bottomScrollAnchor").scrollIntoView({behavior: 'smooth'}), 200)
    window.setTimeout(() => document.getElementById("pseudoInput").focus(), 300)
  }

  handleSubmit(event) {
    event.preventDefault()

    let pseudo = this.state.pseudo || this.state.lastSpeaker
    if (!pseudo) {
      window.alert('Please fill in "Who?" field')
      document.getElementById("pseudoInput").focus()
      return
    }
    let content = this.state.content
    if (!content) {
      window.alert('Please fill in "Said what?" field')
      document.getElementById("contentInput").focus()
      return
    }

    fetch(`/diary/${this.props.id}/entry/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ pseudo, content })
    })
      .then(response => response.json())
      .then(data => this.addEntry(data))
  }

  componentDidMount() {
    document.getElementById('pseudoInput').focus()
    document.getElementById("bottomScrollAnchor").scrollIntoView({behavior: 'smooth'})
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
                <th className="text-center">When?</th>
                <th className="text-center">Who?</th>
                <th className="text-center">What does the fox say?</th>
              </tr>
            </thead>
            <tbody>
            {this.state.entries.map((e) => <EntryView key={e.id} entry={e} />)}
            </tbody>
          </table>
          <div id="bottomScrollAnchor" style={{ float:"left", clear: "both" }} ref={(el) => { this.messagesEnd = el }}></div>
        </div>

        <footer className="footer bg-secondary">
          <form onSubmit={this.handleSubmit}>
            <input id="pseudoInput" placeholder="Who?" type="text" value={pseudo} name="pseudo" onKeyPress={this.handlePseudoKeypress} onChange={this.handlePseudoChange}/>
            <input className="w-75" placeholder="Said what?" id="contentInput" type="text" value={content} name="content" onChange={this.handleContentChange}/>
            <input type="submit" name="Submit" />
          </form>
        </footer>

      </React.Fragment>
    );
  }
}

export default Diary
