import update from 'immutability-helper';

update.extend('$pushConnection', ({ edges, ...others }, connection) => {
  return {
    ...connection,
    ...others,
    edges: [].concat(connection.edges, edges),
  };
});

update.extend('$replaceConnection', (newConnection, _connection) => {
  return newConnection;
});

update.extend('$appendNode', (node, { edges, ...others }) => {
  const cursor =
    edges.length > 0 ? edges[edges.length - 1].cursor : node._id || node.id;

  return {
    ...others,
    edges: [].concat(edges, [
      { node, __typename: `${node.__typename}Edge`, cursor },
    ]),
  };
});

update.extend('$removeNode', (node, { edges, ...others }) => {
  return {
    ...others,
    edges: edges.filter(({ node: { id } }) => node.id !== id),
  };
});

update.extend('$removeFromArray', (node, array) => {
  return array.filter(({ id }) => node.id !== id);
});

export default update;
