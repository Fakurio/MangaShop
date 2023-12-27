export const formatDate = (date: Date) => {
  let newDate = new Date(date);
  let day = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return `${day}/${month}/${year}`;
};
