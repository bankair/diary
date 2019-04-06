import React from "react"
import PropTypes from "prop-types"
import Moment from "moment"
import Entry from "../modules/Entry"

import { createStore } from 'redux'

function reducer(state = { entries: [], lastSpeaker: '' }, action) {
  switch (action.type) {
    case 'LOAD':
      return { entries: action.data.map((body) => new Entry(body)) }
    case 'CREATE':
      let entries = state.entries.slice()
      let entry = new Entry(action.entry)
      entries.push(entry)
      return { entries: entries, lastSpeaker: entry.pseudo }
    case 'DESTROY':
      return { entries: state.entries.filter((e) => e.id != action.id) }
    default:
      return state
  }
}

let store = createStore(reducer)

class Entry {
  constructor(body) {
    this.id = body.id
    this.diary_id = body.diary_id
    this.pseudo = body.pseudo
    this.content = body.content
    this.created_at = body.created_at
  }

  destroy() {
    fetch(`/diary/${this.diary_id}/entry/${this.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      }
    })
      .then(data => store.dispatch({ type: 'DESTROY', id: this.id }))
  }

  static create(diary_id, pseudo, content) {
    fetch(`/diary/${diary_id}/entry/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ pseudo, content })
    })
      .then(response => response.json())
      .then(data => store.dispatch({ type: 'CREATE', entry: data}))
  }
}

class EntryView extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.entry.destroy()
  }

  render () {
    return (
      <tr>
        <td className="entryTime text-muted col-xs-1">{Moment(this.props.entry.created_at).format('HH:mm:ss')}</td>
        <td className="entryPseudo text-primary col-xs-2">{this.props.entry.pseudo}:</td>
        <td className="entryContent col-xl-3">{this.props.entry.content}</td>
        <td className="col-xs-4">
          <button type="button" className="close" aria-label="Close" onClick={this.handleClick}>
            <span aria-hidden="true">&times;</span>
          </button>
        </td>
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
    this.handleUpdate = this.handleUpdate.bind(this);
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

  // addEntry(body) {
  //   let entries = this.state.entries.slice()
  //   let entry = new Entry(body)
  //   entries.push(entry)
  //   this.setState({entries, pseudo: '', content: '', lastSpeaker: entry.pseudo})
  //   window.setTimeout(() => document.getElementById("bottomScrollAnchor").scrollIntoView({behavior: 'smooth'}), 200)
  //   window.setTimeout(() => document.getElementById("pseudoInput").focus(), 300)
  // }

  handleUpdate() {
    const newState = store.getState()
    this.setState({...newState, pseudo: '', content: '' })
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

    Entry.create(this.props.id, pseudo, content)

    // fetch(`/diary/${this.props.id}/entry/`, {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    //   },
    //   body: JSON.stringify({ pseudo, content })
    // })
    //   .then(response => response.json())
    //   .then(data => this.addEntry(data))
  }

  componentDidMount() {
    store.subscribe(this.handleUpdate)
    store.dispatch({ type: 'LOAD', data: this.props.entries })
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
                <th className="text-center">Actions</th>
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
