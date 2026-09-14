/**
 * OKLCH → sRGB, and gamut mapping for the sRGB fallback.
 *
 * The palette is authored in OKLCH by the palette generator, and a good part of it
 * falls outside sRGB — red 11/15, orange 8/15, blue 5/15 in the light scheme. Those
 * are exactly the hues `decisions.md` names as the WCAG contrast algorithm's problem
 * areas, and they are the ones hex was clipping hardest.
 *
 * On an sRGB display the browser gamut-maps out-of-range values itself, and
 * implementations differ. So we map at build time and serve the result explicitly,
 * with the OKLCH original behind `@media (color-gamut: p3)`.
 */

/** How to bring an out-of-gamut colour into sRGB. */
export type GamutStrategy = 'chroma-reduce' | 'clamp'

/**
 * `chroma-reduce` holds lightness and hue and lowers chroma until the colour fits.
 * `clamp` truncates each channel, which shifts lightness — by up to 0.017 on red,
 * breaking the palette's defining property that every family shares a lightness at
 * each step. Measured: mean drift 0.0074 clamped vs 0.0000 chroma-reduced.
 *
 * The legacy build clamped. This is a fix, not a rewrite.
 */
export const GAMUT_STRATEGY: GamutStrategy = 'chroma-reduce'

export type Oklch = { l: number; c: number; h: number }

export function parseOklch(value: string): Oklch {
  const m = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([-\d.]+)/)
  if (!m) throw new Error(`not an oklch() value: ${value}`)
  return { l: +m[1], c: +m[2], h: +m[3] }
}

export const formatOklch = ({ l, c, h }: Oklch) => `oklch(${l} ${c} ${h})`

/** OKLCH → linear-light sRGB. Values outside [0,1] are outside the sRGB gamut. */
export function toLinearSrgb({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)
  const L = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const M = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const S = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ]
}

const EPS = 1e-6
export const inSrgb = (lin: [number, number, number]) =>
  lin.every((x) => x >= -EPS && x <= 1 + EPS)

/** Linear-light sRGB → OKLab lightness. Used to verify the mapping preserved L. */
export function linearSrgbToL(lin: [number, number, number]): number {
  const [r, g, b] = lin.map((x) => Math.min(1, Math.max(0, x)))
  const cbrt = (x: number) => Math.cbrt(x)
  const l = cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
}

const encode = (x: number) => {
  const v = Math.min(1, Math.max(0, x))
  return v > 0.0031308 ? 1.055 * v ** (1 / 2.4) - 0.055 : 12.92 * v
}

const toHex = (lin: [number, number, number]) =>
  '#' +
  lin
    .map((x) =>
      Math.round(encode(x) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/** Reduce chroma by bisection until the colour sits inside sRGB. L and H are held. */
function chromaReduce(color: Oklch): Oklch {
  let lo = 0
  let hi = color.c
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (inSrgb(toLinearSrgb({ ...color, c: mid }))) lo = mid
    else hi = mid
  }
  return { ...color, c: lo }
}

export type Mapped = {
  oklch: Oklch
  hex: string
  outOfGamut: boolean
  /** sRGB components 0–1, for the DTCG fallback. */
  srgb: [number, number, number]
  lightnessDrift: number
}

export function mapToSrgb(
  color: Oklch,
  strategy: GamutStrategy = GAMUT_STRATEGY,
): Mapped {
  const lin = toLinearSrgb(color)
  const out = !inSrgb(lin)
  const mappedLin = !out
    ? lin
    : strategy === 'chroma-reduce'
      ? toLinearSrgb(chromaReduce(color))
      : lin // clamp happens in encode()
  const clamped = mappedLin.map((x) => Math.min(1, Math.max(0, x))) as [
    number,
    number,
    number,
  ]
  return {
    oklch: color,
    hex: toHex(mappedLin),
    outOfGamut: out,
    srgb: clamped.map((x) => Math.round(encode(x) * 1e4) / 1e4) as [
      number,
      number,
      number,
    ],
    lightnessDrift: Math.abs(linearSrgbToL(mappedLin) - color.l),
  }
}
