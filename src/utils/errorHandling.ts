//Firestoreエラーかどうか判定する型ガード
export function isFireStoreError(
  // unknown型は TypeScript で「どんな値が来るか分からない」ことを表す最も安全な型
  err: unknown
  // 「err is { code: string; message: string }」は、
  // trueを返した場合、errが「codeとmessageというstring型のプロパティを持つオブジェクト」であることを保証する
): err is { code: string; message: string } {
  // ①: まず err が object 型かどうかをチェック
  // ②: err が null でないことをチェック（JavaScriptでは typeof null も 'object' を返すため）
  // ③: err オブジェクトに 'code' プロパティが存在するかチェック
  return typeof err === 'object' && err !== null && 'code' in err;
}
