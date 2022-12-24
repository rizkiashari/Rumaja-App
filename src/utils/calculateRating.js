export const calculateRating = (arrayRating) => {
  if (arrayRating?.length === 0) {
    return 0;
  }

  const total =
    arrayRating?.reduce((acc, curr) => {
      return acc + curr.rating;
    }, 0) / arrayRating?.length;

  return total;
};
