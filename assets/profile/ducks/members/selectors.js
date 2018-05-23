const getSelf = state => state.self;
const getMemberFromId = (state, id) => state.members[id];

export default {
  getSelf,
  getMemberFromId,
};
