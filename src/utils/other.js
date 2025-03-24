const getSession = (sessionsObj, date, index = -1) => {
  const session = sessionsObj[date].at(index);
  return {
    join: session[0],
    exit: session[1],
    duration: session[1] - session[0],
  };
};

module.exports = {
  getSession,
};
