/**
 * sheetsHelpers.ts
 *
 * Purpose: Helpers for preparing payloads and ranges for Google Sheets
 * operations. Keep transformation logic here so API routes only handle
 * request/response concerns and authorization.
 */

export function buildValueRange(values: unknown[][]) {
  return { values };
}

export function a1Range(sheetName: string, startRow: number, startCol: number, endRow?: number, endCol?: number) {
  const colToA1 = (n: number) => {
    let s = '';
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  };

  const start = `${colToA1(startCol)}${startRow}`;
  const end = endRow && endCol ? `${colToA1(endCol)}${endRow}` : undefined;
  return end ? `${sheetName}!${start}:${end}` : `${sheetName}!${start}`;
}

export function appendRowPayload(row: unknown[]) {
  return buildValueRange([row]);
}
