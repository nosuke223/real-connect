export const notNullRule = (value) => {
  return !!value || "入力してください";
};

export const emailFormatRule = (value) => {
  return /.+@.+\.\w+/.test(value) || "メールアドレスの形式が正しくありません";
};
// 空白でなければ半角数字7桁を許容
export const zipCodeRule = (value) => {
  return (
    /^[0-9]{7}$/.test(value) || !value || "半角数字7桁で入力してください。"
  );
};
