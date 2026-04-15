const cyprusFormatter = new Intl.NumberFormat("el-CY", {
  style: "currency",
  currency: "EUR",
});

export function euro(num: number) {
  return cyprusFormatter.format(num);
}
