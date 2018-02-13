import React from 'react';
import DateGroup from './DateGroup';

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="dates">
        {Object.keys(this.props.data).map((key) => (
          <DateGroup date={key} events={this.props.data[key]} />
        ))}
      </div>
    )
  }
}

export default App