export const askCleo = async (query) => {
  return {
    provider: 'local',
    confidence: 0.9,
    answer: 'I am Cleo. This is a mock response.',
    results: []
  };
};
