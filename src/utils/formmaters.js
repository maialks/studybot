const formatTime = (timeMS) => {
  return {
    hrs: Math.floor(timeMS / 1000 / 60 / 60),
    min: Math.round((timeMS / 1000 / 60) % 60),
    sec: Math.round((timeMS / 1000 / 60 / 60) % 60),
  };
};

module.exports = {
  formatTime,
};
