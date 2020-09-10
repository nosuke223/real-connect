export const notNullRule = (value) => {
  return !!value || "入力してください";
};

export const emailFormatRule = (value) => {
  return /.+@.+\.\w+/.test(value) || "メールアドレスの形式が正しくありません";
};
// 空白でなければ半角数字7桁を許容
export const zipCodeRule = (value) => {
  return (
    /^[0-9]{3}[0-9]{4}$/.test(value) ||
    !value ||
    "郵便番号は「-」なしの7桁で入力してください"
  );
};
