import React from 'react';

class PrimaryRules extends React.Component {
  constructor(props) {
    super(props);

    this.typeDescs = {
      open: 'Any registered voter can vote in any party\u2019s primary.',
      'semi-open': 'Any registered voter can vote for either party, but they must request a specific party\u2019s ballot. This information may be collected by election officials.',
      'semi-closed': 'Voters registered to a particular party can vote in their party\u2019s primary. Registered voters with no party affiliation can vote in any party\u2019s primary.',
      closed: 'Only voters registered to a party can vote in that party\u2019s primary.',
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