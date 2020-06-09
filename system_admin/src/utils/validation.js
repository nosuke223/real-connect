export const notNullRule = (value) => {
  return !!value || "入力してください";
};

export const emailFormatRule = (value) => {
  return /.+@.+\.\w+/.test(value) || "メールアドレスの形式が正しくありません";
};
