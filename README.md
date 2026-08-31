# BESA Park — Static Website Source

This is the editable source for the BESA Park website. It exports to ordinary static HTML, CSS, JavaScript and image files, so it can be hosted cheaply on Netlify or any standard static web host.

## Edit and preview

1. Install Node.js 22 or newer.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local address shown in the terminal.

The page content is in `app/`, shared sections are in `components/`, and the property images are in `public/besa-assets/`.

## Create a fresh upload package

1. Run `npm run build`.
2. The finished static website will appear in the `out/` folder.
3. Upload the **contents** of `out/` to Netlify or another static host.

## Important note about the enquiry form

The form is currently a visual enquiry form only. It does not send submissions until it is connected to an email or form service.
