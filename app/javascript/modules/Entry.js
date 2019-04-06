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
    this.details = body.details
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

  static create(diary_id, pseudo, content, details) {
    fetch(`/diary/${diary_id}/entry/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ pseudo, content, details })
    })
      .then(response => response.json())
      .then(data => store.dispatch({ type: 'CREATE', entry: data}))
  }

  static store() {
    return store
  }
}
export default Entry
