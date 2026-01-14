const deslugify = (slug: string) => {
  return slug
    .replace(/-/g, " ") // ganti - jadi spasi
    .replace(/\b\w/g, (char) => char.toUpperCase()); // kapital tiap kata
};

export default deslugify;
