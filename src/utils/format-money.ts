export const formatMoney = (amount: number | string, hideGh?: boolean) => {
  const amountParsed = (amount || 0).toString().replace(",", "");
  const amountFormated = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(Number(amountParsed));
  return amountFormated.replace("GH₵", hideGh ? "₵" : "GHS ");
};


