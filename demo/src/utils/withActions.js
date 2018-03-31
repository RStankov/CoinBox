import { connect } from 'react-redux';

export default function withActions(actions) {
  return connect(null, actions);
}
