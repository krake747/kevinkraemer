# Motion

Source of truth: `@theme inline` (easing curves, `--animate-fade-up`, `--animate-rise`,
`--animate-confirm-in`), `@utility kk-cascade`, `@utility filter-enter`, `@utility accordion`,
`scroll-fade-y` / `scroll-fade-x`, `.reveal-item` in `src/app.css`,
`src/pattern/create-scroll-reveal.ts`, `src/features/theme/toggle.tsx`.

Motion is the terminal's cursor, not an entrance effect. The page arrives once, then reacts to
pointing and pressing. If a new animation makes the reader wait or look at it, delete it.

## What may animate

`transform` and `opacity`. Nothing else.

```
layout, width, height, top/left, filter, box-shadow, background-color
```

Why: those force layout or paint every frame, and the page is mostly text, the one thing a reflow
hurts most. Color is different: a row's ground and border may transition with `transition-colors`
(`duration-150` on a control, `duration-200` on a log row), because color does not reflow.

- Accordion open/close is the one layout exception. `.accordion` transitions `::details-content`
  `block-size`, because a collapsible has to change how much page it occupies and no transform
  produces that. It stays scoped to that one utility.
- Never `transition-all`. It silently animates layout properties the day someone adds one.
- Hover that **moves or appears** is gated with `hover:pointer-fine:*`: an arrow that slides. A
  color hover on a link is not gated: the tap navigates away, so nothing sticks. Write the variant
  first: `hover:pointer-fine:translate-x-1`, not `pointer-fine:hover:…`.
- The header home mark is static. It is a navigation link used often, so its hover offers no motion:
  the hit area is the affordance. A wordmark that rotates is decoration on the one element the
  visitor needs to recognise instantly.
- Press feedback is `active:scale-97`, on small controls only (`Button`, `Chip`). A whole row or
  panel never scales; its feedback is the ground change.

## High-frequency surfaces

The command palette is opened from the keyboard, so its row indicator and arrow-key highlight are
instant. A `duration-150` fade trails arrow-key highlight and reads as lag, and a control used at
that frequency has no motion to remove. In the palette, only the overlay moves: content fades from
`opacity: 0` and `scale(0.98)` in `duration-150` and leaves in `duration-100`; the backdrop fades in
`duration-150` and out in `duration-100`, all `ease-out-quart`, through ui-sdk's
`data-starting-style` / `data-ending-style`. Never `scale(0)`. Focus lands in the input as it
mounts, so the entrance never delays the first keystroke.

Both parts also carry `data-closed:opacity-0`. ui-sdk clears `data-ending-style` a few frames before
it unmounts the dialog, so without the closed-state rule the scrim snaps back to `opacity: 1` and
flashes dark between the end of the fade and the unmount.

## Duration and easing

House curve is `ease-out-quart`: fast out, dead stop. No bounce, spring, or overshoot. Exit is
faster than entry. Durations and tokens live in `src/app.css`.

## Reveal cadence

A staggered reveal is a property of the **container**, not of each child:

```tsx
<div class="kk-cascade">
  <div>first</div>
  <div>second</div>
</div>
```

- `kk-cascade` sets `animation-delay` on children 1–8, then holds the 9th step for everything after.
- Override the step with the `--kk-cascade-step` custom property. The default lives in
  `@utility kk-cascade`; the 404 page overrides the step to a tighter value.
- The hero is the exception: its blocks use explicit `[animation-delay:*]` literals and
  `HomeHeroName` sets a per-character delay, because character timing cannot come from a child
  index.
- The hero lede, about block, and contact block use `animate-rise`, not `animate-fade-up`, as do the
  `DocumentPage` and CV headers. A fade starts at `opacity: 0`, and the browser does not count an
  invisible element as painted, so the entrance would push LCP to the end of the animation. Rise
  animates `transform` only: the text is painted on the first frame and still settles into place.
  Use `animate-rise` for any entrance that carries the page's largest text block, never a fade. The
  hero name keeps its character slide, also transform only.

A filterable list splits the two jobs. The container keeps the arrival (`animate-fade-up`) and never
replays it; only rows that a filter inserts get `filter-enter`, an opacity transition from
`@starting-style`, so surviving rows do not blink. The `[data-settled]` gate is what keeps the rows
from fading a second time underneath the container's arrival: it is set once after mount, and
`@starting-style` only applies to rows inserted later. Replaying a keyed fade on the whole list
instead makes every chip press look like a page load and restarts from `opacity: 0` when the reader
clicks twice.

Scroll entrance uses `.reveal-item` plus the `createScrollReveal()` ref callback: the element is
invisible until it enters, then it plays `fade-up` once. It animates transform and opacity only. A
section already scrolled past when its ref attaches is revealed without stagger, because its
observer entry never fires and the reader would meet hidden content on the way back up.

## Scroll edges

`scroll-fade-y` and `scroll-fade-x` fade a scroll container's edge while there is content past it,
and stop at the end. Two registered custom properties are driven by `animation-timeline: scroll()`
and composed into a `mask-image`. It is position feedback, not time-based motion: nothing moves, the
fade tracks the thumb.

- Build it from longhands. The `animation` shorthand next to `animation-timeline` gets minified into
  one invalid declaration that the browser drops, leaving no animation at all.
- No scroll-timeline support means no mask. A permanent fade on a list that already fits is worse
  than no fade, so the whole utility sits inside `@supports`.

## Reduced motion

The block in `@layer base` clears every animation delay and collapses entrance animations to a
near-zero duration, and turns off `scroll-behavior` under `prefers-reduced-motion: reduce`.
Transitions are narrowed to the properties that still carry meaning (color, background, border,
outline, fill, stroke, opacity) at the reduced-motion transition duration in `src/app.css`, so
movement (`transform`, `scale`, `block-size`) snaps while state and color feedback stay legible.
`kk-cascade` zeroing its delays is belt and braces. `.reveal-item` is forced to `opacity: 1` and
`.hero-char` drops its animation.

- A new animation gets no exemption. The global block covers elements; a rule on a pseudo-element
  (`::details-content`) is outside its universal selector and carries its own. `.accordion` is the
  one that does.
- Never hide content behind an animation that reduced-motion cancels. If an element starts at
  `opacity: 0` via a class, it needs the reduced-motion rule that restores it. `.reveal-item` is the
  pattern.

## Theme swap

`applyWithoutTransitions` in `src/core/theme.ts` adds `disable-transitions` to `<html>` for two
frames, then removes it, so the light/dark swap does not fade every color on the page. Do not
animate the page swap. The toggle's Sun/Moon state icon is the one exception: a scoped rule keeps
its crossfade running during the two-frame window, so the control confirms the change while the rest
of the page snaps. Under `prefers-reduced-motion: reduce`, the page still snaps and the icons keep
only their reduced-motion opacity/color transition; the scale and rotation snap.
