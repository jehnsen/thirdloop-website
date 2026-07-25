# Team headshots

Drop member photos here, then point at them from `src/lib/team.ts`:

```ts
photo: "/team/jehnsen-enrique.jpg",
```

## Image requirements

- **Square crop** — the slot is `aspect-square` and the image is `object-cover`,
  so a non-square file gets cropped from the centre. Crop it yourself if you
  want control over the framing.
- **At least 480×480**, ideally 800×800. The largest render is ~240px at 2x DPI.
- **JPEG or WebP.** Next.js optimises and serves modern formats automatically.
- Keep the filename matching the member slug (`jehnsen-enrique.jpg`).

A member with no `photo` falls back to the gradient monogram — both occupy the
same square, so adding a photo never shifts the layout.
