import React from 'react';
import Loading from 'components/Loading';

export default function withLoading(Component) {
  return props => {
    if (props.data.loading) {
      return <Loading />;
    }

    return <Component {...props} />;
  };
}
