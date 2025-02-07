export const MONTH_NAMES = [
  "Janv",
  "Fev",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juilet",
  "Aout",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const dateFormat = (mydate: any) => {
  try {
    const date = new Date(mydate)
    // console.log("date", date, typeof date)
    const dateF = ` ${String(date.getDate()).padStart(2, "0")}/${MONTH_NAMES[date.getMonth()]
      }/${date.getFullYear()}`;
    return dateF;
  } catch (error) {
    console.log("dateFormat eror", error);
    return "ERROR";
  }
};
export default dateFormat;
export const formatDateYMD = (date: any) => {
  return date ? new Date(date).toISOString().split("T")[0] : ""; // Format YYYY-MM-DD
};
