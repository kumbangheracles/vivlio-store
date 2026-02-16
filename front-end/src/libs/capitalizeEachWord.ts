function capitalizeWords(str: string) {
  str = str?.toLowerCase();
  const words = str?.split(" ");

  const capitalizedWords = words?.map((word) => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });

  return capitalizedWords?.join(" ");
}

export default capitalizeWords;
