import React from 'react';

class PrimaryRules extends React.Component {
  constructor(props) {
    super(props);

    this.typeDescs = {
      open: 'Any registered voter can vote for either party.',
      'semi-open': 'Any registered voter can vote, but they must request a specific ballot. This information may be collected by election officials.',
      'semi-closed': 'Voters registered to a particular party and registered voters with no party affiliation can vote.',
      closed: 'Only voters registered to this party can vote.',
      jungle: 'All candidates are put on the same ballot regardless of party, and the top two candidates in vote share advance to the general.',
    }
  }

  render() {
    let typeDesc = '';
    if (this.props.event.dem_primary_type === this.props.event.gop_primary_type) {
      typeDesc = this.typeDescs[this.props.event.dem_primary_type];
    }

    return (
      <p>{typeDesc}</p>
    )
  }
}

export default PrimaryRules;