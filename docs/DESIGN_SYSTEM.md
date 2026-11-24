# SaveLoop UI design system

This design closely follows the approved desktop concept: near-black surfaces, rust-orange highlights, subtle glowing curves and soft gradients, elegant rounded cards, compact icons, and clear typography.

- Main background: `#0b0909`
- Panel surface: `#171211`
- Elevated surface: `#251b17`
- Rust orange: `#cf5528`
- Main accent: `#fa7433`
- Accent light: `#ff9b5d`
- Text: `#f8f1ed`
- Secondary text: `#a99991`
- Fonts: Outfit (headlines) and DM Sans (body)
- Motion: `motion/react` (hover, appearance and AI panel)
- Illustrative bookmark graphics: CSS gradient artwork (not user-post thumbnails)
- Icons: Lucide React

## Layout ownership

`PublicLayout` owns the landing navigation. `AuthLayout` owns the shared two-panel login/signup design. `UserLayout` owns the sidebar/topbar and floating AI assistant. `AdminLayout` owns the admin sidebar/topbar. Each page adds its own content inside `<Outlet />`.

## Design limitations

The original concept art contains features such as subscription pricing and automatic content summarisation that are outside the provided 14-day MVP. Those are not represented as working features in this code. The running application uses safe, legal, user-provided bookmark details instead.
