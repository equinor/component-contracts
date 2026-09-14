/** apca-w3 ships no type declarations — editor-facing only; Node's type
 *  stripping never reads this file. The algorithm itself is the published
 *  package (intent.md: use an established implementation, never a port). */
declare module 'apca-w3' {
  export function sRGBtoY(rgb: [number, number, number]): number
  export function APCAcontrast(
    txtY: number,
    bgY: number,
    places?: number,
  ): number
}
