import React from 'react';

class PrimaryType extends React.Component {
  constructor(props) {
    super(props);

    this.typeDescs = {
      open: 'Any registered voter can vote.',
      'semi-open': 'Any registered voter can vote, but they must request this party\u2019s ballot.',
      'semi-closed': 'Voters registered to this party and registered voters with no party affiliation can vote.',
      closed: 'Only voters registered to this party can vote.',
      jungle: 'All candidates are put on the same ballot regardless of party, and the top two candidates in vote share advance to the general.',
    }

    this.parties = {
      dem: 'Democratic primary',
      gop: 'Republican primary',
    }
  }

  render() {
    const classes = `party-primary-type ${this.props.party} col-md-6`

    return (
      <div className={classes}>
        <h5>{this.parties[this.props.party]}</h5>
        <p>{this.typeDescs[this.props.type]}</p>
      </div>
    )
  }
}

export default PrimaryType;