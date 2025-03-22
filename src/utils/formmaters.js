const formatMS = (timeMS) => {
  return {
    hrs: Math.floor(timeMS / 1000 / 60 / 60),
    min: Math.round((timeMS / 1000 / 60) % 60),
    sec: Math.round((timeMS / 1000 / 60 / 60) % 60),
  };
};

const getHHMM = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo',
  });
};

module.exports = {
  formatMS,
  getHHMM,
};
