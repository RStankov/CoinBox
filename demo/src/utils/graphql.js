import { get, setWith } from 'lodash';
import update from 'utils/update';

export function mapNodes(connection, fn) {
  return connection.edges.map(({ node }) => fn(node));
}

export function getNodes(connection) {
  return connection.edges.map(({ node }) => node);
}

export function hasNextPage(connection) {
  return connection.pageInfo.hasNextPage;
}

export function countNodes(data) {
  if (!data || !data.edges) {
    return 0;
  }

  return data.edges.length;
}

export function loadMore({ data, connectionPath, cursorName, variables }) {
  return data.fetchMore({
    variables: {
      ...data.variables,
      ...(variables || {}),
      [cursorName || 'cursor']: get(data, connectionPath).pageInfo.endCursor,
    },
    updateQuery(previousResult, { fetchMoreResult, ...rest }) {
      return updatePath(previousResult, connectionPath, {
        $pushConnection: get(fetchMoreResult, connectionPath),
      });
    },
  });
}

function updatePath(previousResult, connectionPath, changes) {
  const toUpdate = {};
  setWith(toUpdate, connectionPath, changes, Object);

  return update(previousResult, toUpdate);
}
