export const parseCreatorQuery = (query) => {
  return { intent: 'search', query };
};

export const matchCreators = (query, creators) => {
  return creators; // Mock
};
