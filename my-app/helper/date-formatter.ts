const transformDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    return `${day}/${meses[parseInt(month) - 1]}`;
  };
  
  export default transformDate;
  