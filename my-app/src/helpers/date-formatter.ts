const transformDate = (dateString: string): [string, string] => {
  const [year, month, day] = dateString.split("-");
  const monthes = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  return [day, monthes[parseInt(month) - 1]];
};

export default transformDate;
