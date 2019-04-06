import React from "react"
import Entry from "../modules/Entry"
import Moment from "moment"

class EntryDetailsRow extends React.Component {
  prettify(details) {
    let result = details
    let matches = details.match(/(https?|ftp|ssh|mailto):\/\/[a-z0-9\/:%_+.,#?!@&=-]+/gi)
    if (matches) {
      matches.forEach(
        function(url) { result = result.replace(url, `<a href="${url}" target="_blank">${url}</a>`) }
      )
    }
    return(<pre dangerouslySetInnerHTML={{__html: result}} />)
  }

  render() {
    if (this.props.details) {
      return (
        <tr>
          <td className="entryTime text-muted col-xs-1"></td>
          <td className="entryPseudo col-xs-2"></td>
          <td className="entryContent col-xl-3">{this.prettify(this.props.details)}</td>
          <td className="col-xs-4"></td>
        </tr>
      )
    } else {
      return null
    }
  }
}

class EntryView extends React.Component {
  constructor(props) {
    super(props)
    this.handleDestroyClick = this.handleDestroyClick.bind(this);
  }

  handleDestroyClick() {
    let r = confirm(`Delete "${this.props.entry.pseudo}: ${this.props.entry.content}"?`)
    if (r == true) {
      this.props.entry.destroy()
    }
  }

  render () {
    return (
      <>
        <tr>
          <td className="entryTime text-muted col-xs-1">{Moment(this.props.entry.created_at).format('HH:mm:ss')}</td>
          <td className="entryPseudo col-xs-2">{this.props.entry.pseudo}:</td>
          <td className="entryContent col-xl-3">{this.props.entry.content}</td>
          <td className="col-xs-4">
            <button type="button" className="close" aria-label="Close" onClick={this.handleDestroyClick}>
              <span aria-hidden="true">&times;</span>
            </button>
          </td>
        </tr>
        <EntryDetailsRow details={this.props.entry.details} />
      </>
    );
  }
}
export default EntryView
