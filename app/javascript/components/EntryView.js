import React from "react"
import Entry from "../modules/Entry"
import Moment from "moment"

class EntryView extends React.Component {
  constructor(props) {
    super(props)
    this.handleDestroyClick = this.handleDestroyClick.bind(this);
  }

  handleDestroyClick() {
    let r = confirm(`Delete "${this.props.entry.pseudo}: ${this.props.entry.content}"?`)
    console.log(r)
    if (r == true) {
      this.props.entry.destroy()
    }
  }

  render () {
    return (
      <tr>
        <td className="entryTime text-muted col-xs-1">{Moment(this.props.entry.created_at).format('HH:mm:ss')}</td>
        <td className="entryPseudo text-primary col-xs-2">{this.props.entry.pseudo}:</td>
        <td className="entryContent col-xl-3">{this.props.entry.content}</td>
        <td className="col-xs-4">
          <button type="button" className="close" aria-label="Close" onClick={this.handleDestroyClick}>
            <span aria-hidden="true">&times;</span>
          </button>
        </td>
      </tr>
    );
  }
}
export default EntryView
