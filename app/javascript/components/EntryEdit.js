import React from "react"
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Entry from "../modules/Entry"

class EntryEdit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pseudo: '',
      content: '',
      details: '',
      currentDetails: '',
      showDetailModal: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleShowDetailsModal = this.handleShowDetailsModal.bind(this);
    this.handleCancelDetailsModal = this.handleCancelDetailsModal.bind(this);
    this.handleSaveDetailsModal = this.handleSaveDetailsModal.bind(this);
    this.handlePseudoChange = this.handlePseudoChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handlePseudoKeypress = this.handlePseudoKeypress.bind(this);
    this.handleDetailsChange = this.handleDetailsChange.bind(this)
  }

  handleDetailsChange(event) {
    this.setState({currentDetails: event.target.value})
  }

  handleShowDetailsModal(event) {
    this.setState({ showDetailModal: true, currentDetails: this.state.details });
    event.preventDefault()
  }

  handleCancelDetailsModal(event) {
    this.setState({ showDetailModal: false });
  }

  handleSaveDetailsModal(event) {
    this.setState({ showDetailModal: false, details: this.state.currentDetails });
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
      node = document.getElementById("pseudoInput")
      node.focus()
      node.select()
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

        <a href='#' onClick={this.handleShowDetailsModal}>+ {this.state.details ? 'Edit' : 'Add'} details (logs, commands, ...)</a>

        <Modal show={this.state.showDetailModal} onHide={this.handleCancelDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <textarea style={{width: '-webkit-fill-available'}} value={this.state.currentDetails} onChange={this.handleDetailsChange}></textarea>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCancelDetailsModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleSaveDetailsModal}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

      </>
    )
  }
}
export default EntryEdit
