import React from "react"
import Entry from "../modules/Entry"

class EntryDetailModal extends React.Component {
  render() {
    return (
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class EntryEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pseudo: '',
      content: '',
      details: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePseudoChange = this.handlePseudoChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handlePseudoKeypress = this.handlePseudoKeypress.bind(this);
  }

  handlePseudoChange(event) { this.setState({pseudo: event.target.value}); }
  handleContentChange(event) { this.setState({content: event.target.value}); }
  handlePseudoKeypress(event) {
    if (event.key == 'Enter') {
      event.preventDefault()
      document.getElementById('contentInput').focus()
    }
  }

  handleSubmit(event) {
    event.preventDefault()

    let pseudo = this.state.pseudo
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

    Entry.create(this.props.diary_id, pseudo, content, this.state.details)
    this.setState({content: '', details: ''})
  }


  render () {
    let pseudo = this.state.pseudo
    let content = this.state.content
    return(
      <>




        <form onSubmit={this.handleSubmit}>
          <input id="pseudoInput" placeholder="Who?" type="text" value={pseudo} name="pseudo" onKeyPress={this.handlePseudoKeypress} onChange={this.handlePseudoChange}/>
          <input className="w-75" placeholder="Said what?" id="contentInput" type="text" value={content} name="content" onChange={this.handleContentChange}/>
          <input type="submit" name="Save log" />
        </form>
      </>
    )
  }
}
export default EntryEdit
