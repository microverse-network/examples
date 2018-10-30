export default async arr =>
  arr.reduce((res, item) => res + item, 0) / arr.length
