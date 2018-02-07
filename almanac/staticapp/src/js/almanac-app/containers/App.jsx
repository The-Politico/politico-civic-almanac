import { h, Component } from 'preact';
import DateGroup from './DateGroup';

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="dates container">
        {Object.keys(this.props.data).map((key) => (
          <DateGroup date={key} events={this.props.data[key]} />
        ))}
      </div>
    )
  }
}

export default App