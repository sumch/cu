formBridge.events.on('form.show', async function (context) {
  ahid2(context, 'sele10', true);

  // --- q01〜q39 radioボタンのタイトルをAPIのstrで置き換え ---
  const API_URL = 'https://f1762abc.viewer.kintoneapp.com/public/api/records/2feaae2f724401ff0d7e3171a1b58d5f30fdef6eaddc39875b66290e80816dea/1';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('API fetch failed: ' + res.status);
    const json = await res.json();

    // レスポンス: { records: [{ str: { value: '...' } }, ...] }
    const records = json?.records;
    if (!Array.isArray(records) || records.length === 0) {
      throw new Error('records が取得できませんでした');
    }

    // fc フィールドの値（q01〜q39）を使ってDOM要素を特定
    records.forEach(function(record) {
      const fieldCode = record?.fc?.value;   // e.g. "q39"
      const title     = record?.str?.value;
      if (!fieldCode || !title) return;

      // q01〜q39 の番号を取得して先頭に付ける
      const num = parseInt(fieldCode.replace('q', ''), 10); // e.g. 39

      const fieldEl = document.querySelector('[data-field-code="' + fieldCode + '"]');
      if (!fieldEl) return;

      const titleEl = fieldEl.querySelector('.form-group-title, .field-title, label');
      if (!titleEl) return;

      titleEl.textContent = num + '. ' + title.trim();
    });

  } catch (e) {
    console.error('[cu5] radioタイトル更新エラー:', e);
  }
});
//整数、または小数点以下が1桁までの小数を許可する正規表現
function validateDecimal1(value) {
  // 正規表現の意味:
  // ^      : 文字列の先頭
  // -?     : 負の符号（あってもなくても良い）
  // \d+    : 1つ以上の数字
  // (\.\d)?: 小数点とそれに続く1つの数字（あってもなくても良い）
  // $      : 文字列の末尾
  const regex = /^-?\d+(\.\d)?$/;
  return regex.test(value);
}
const validateDecimal1Fields = [
'p07_1',
'p07_2',
];
validateDecimal1Fields.forEach(fc => {
  formBridge.events.on('form.field.change.' + fc, function(context) {
    var ts = context.value;
    if(validateDecimal1(ts)) {
      context.setFieldValueError(fc, null);
    } else {
      context.setFieldValueError(fc, '小数点第１位まで入力ください');
    }
    return context;
  });
});
