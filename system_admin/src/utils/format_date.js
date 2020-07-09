export const formatDateTime = (strDateTime) => {
  if (!strDateTime) {
    return "";
  }
  const dateTime = new Date(strDateTime);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const day = dateTime.getDate();
  const hour = ("0" + dateTime.getHours()).slice(-2);
  const minutes = ("0" + dateTime.getMinutes()).slice(-2);
  return `${year}-${month}-${day} ${hour}:${minutes}`;
};

export const formatTime = (strDateTime) => {
  if (!strDateTime) {
    return "";
  }
  const dateTime = new Date(strDateTime);
  const hour = ("0" + dateTime.getHours()).slice(-2);
  const minutes = ("0" + dateTime.getMinutes()).slice(-2);
  return `${hour}:${minutes}`;
};

export const isHoliday = (bool) => {
  if (!bool) {
    return "";
  } else {
    return "お休み";
  }
};

export const formatDate = (strDateTe) => {
  if (!strDateTe) {
    return "";
  }
  const date = new Date(strDateTe);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};
