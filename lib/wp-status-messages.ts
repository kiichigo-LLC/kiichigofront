/** SSR / クライアントで同じ seed なら同じ文言（Math.random は hydration で壊れる） */
export function pickMessageFromSeed(
  messages: readonly string[],
  seed: string,
  random: boolean
): string {
  if (!random || messages.length === 0) return messages[0] ?? "";
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return messages[Math.abs(h) % messages.length]!;
}
