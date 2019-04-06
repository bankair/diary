import React from "react"
import PropTypes from "prop-types"
import Entry from "../modules/Entry"
import EntryView from "./EntryView"
import EntryEdit from "./EntryEdit"

class Diary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { entries: [] }
    this.handleUpdate = this.handleUpdate.bind(this);
  }


  handleUpdate() {
    const newState = Entry.store().getState()
    this.setState(newState)
    window.setTimeout(() => document.getElementById("bottomScrollAnchor").scrollIntoView({behavior: 'smooth'}), 200)
    window.setTimeout(() => document.getElementById("pseudoInput").focus(), 300)
  }


  componentDidMount() {
    this.unsubscribe = Entry.store().subscribe(this.handleUpdate)
    Entry.store().dispatch({ type: 'LOAD', data: this.props.entries })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render () {
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

        <footer className="footer bg-light"><EntryEdit diary_id={this.props.id}/></footer>

      </React.Fragment>
    );
  }
}

export default Diary
