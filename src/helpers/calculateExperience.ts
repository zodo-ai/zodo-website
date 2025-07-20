export const calculateExperience = (joiningDate: string): string => {
  const joinDate = new Date(joiningDate);
  const currentDate = new Date();

  let years = currentDate.getFullYear() - joinDate.getFullYear();
  let months = currentDate.getMonth() - joinDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const totalYears = years + months / 12;
  const roundedYears = Math.round(totalYears * 10) / 10; // round to 1 decimal

  return `${roundedYears} years`;
};