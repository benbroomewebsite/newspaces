# Next steps

## Shelter Studio meeting

- Confirm the organisation name, purpose, status and wording that can be public.
- Identify the primary audience and what visitors should be able to do.
- Decide initial sections: programme, archive, About, grants, support or contact.
- Choose which portfolio conventions to retain: index, filters, slideshow, project galleries.
- Agree branding, typography, accessibility requirements and mobile priorities.
- Gather approved copy, image rights, credits, alt text and any video/PDF requirements.
- Confirm domain, contact details, editor access, hosting and launch responsibility.

The example entries are for layout review and should be replaced or removed
before launch. The site supports an empty archive and projects without images.

## Media on Ben's Cloudflare account — later

No remote configuration is needed yet. Keep using local uploads for the samples.
Once the assets and account are ready:

1. Verify Wrangler's signed-in user and select Ben's intended account explicitly.
2. Create a separate New Spaces bucket; record its account and bucket identity.
3. Agree public media URL, object naming, upload limits and media ownership.
4. Upload the approved assets with correct MIME types and verify representative
   images, videos, PDFs and PDF range requests through the public URL.
5. Add site-path-to-object-key entries to `lib/media-map.json` and set
   `NEXT_PUBLIC_MEDIA_BASE_URL`. Keep local originals until verification passes.
6. Rebuild, check project images and sharing metadata, then decide whether future
   editor uploads should stay in Git or use a separate upload workflow.

The public media base is not a credential. Account tokens belong in local/server
secret storage. Do not bring over the portfolio's account defaults or credentials.
