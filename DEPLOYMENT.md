# Wedding Bingo production deployment

## Why the CORS error happened

The deployed frontend was built with `http://localhost:5000` as its API URL because `VITE_API_BASE_URL` was not defined at build time. A browser cannot let a public HTTPS website call a user's loopback address. The production frontend now uses `VITE_API_BASE_URL` when supplied and otherwise falls back to same-origin requests; set the variable explicitly when the API is hosted on Render.

## Recommended architecture

Deploy the React frontend to Vercel and the Express/MongoDB API to Render. Use MongoDB Atlas for the database and ImageKit for media. The frontend must be built with the public Render API URL, while the Render service must allow the public frontend origin through `FRONTEND_URL` and `CORS_ORIGINS`.

## 1. Prepare MongoDB Atlas

Create a MongoDB Atlas cluster and database named `weddingbingo`. Create a database user, copy the SRV connection string, and add Render's outbound access policy as required by your Atlas plan. Replace the username, password, and database name in the connection string.

## 2. Deploy the API to Render

Create a new **Web Service** in Render from this repository. The included `render.yaml` can also be used through Render Blueprint deployment.

Use these settings if configuring manually:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm ci --omit=dev` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Set these environment variables in Render:

- `NODE_ENV=production`
- `MONGODB_URI=<MongoDB Atlas SRV URL>`
- `JWT_SECRET=<long random secret, minimum 32 characters>`
- `JWT_EXPIRES_IN=2h`
- `ADMIN_EMAIL=<your admin email>`
- `ADMIN_PASSWORD=<strong initial admin password>`
- `ADMIN_NAME=Wedding Bingo Owner`
- `FRONTEND_URL=https://<your-vercel-domain>`
- `CORS_ORIGINS=https://<your-vercel-domain>`
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`
- SMTP variables if email notifications are required

After deployment, verify `https://<your-render-service>.onrender.com/health` returns JSON with `status: "ok"`. Copy the Render service URL; this becomes the frontend API URL.

## 3. Deploy the frontend to Vercel

Import the repository into Vercel. Keep the project root at the repository root because the included root `vercel.json` builds `frontend` and publishes `frontend/dist`. Alternatively, set the Vercel Root Directory to `frontend` and use the frontend `vercel.json`.

Set this Vercel environment variable for **Production**, **Preview**, and **Development** as appropriate:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
```

Deploy or redeploy after saving the variable. Vite injects `VITE_*` variables during the build, so changing the variable requires a new deployment.

## 4. Complete CORS configuration

Once Vercel gives you the final domain, update Render's `FRONTEND_URL` and `CORS_ORIGINS` to that exact origin, including `https://` and excluding a trailing slash. For a custom domain, use the custom domain instead. For a Vercel preview domain, add it as a comma-separated second origin only if preview testing is required.

Example:

```text
FRONTEND_URL=https://weddingbingo.vercel.app
CORS_ORIGINS=https://weddingbingo.vercel.app,https://weddingbingo-git-main-example.vercel.app
```

Redeploy the Render service after changing environment variables.

## 5. If keeping the current Netlify frontend

Set Netlify's build environment variable:

```text
VITE_API_BASE_URL=https://<your-render-service>.onrender.com
```

Use `npm run build` from the `frontend` directory, or set the Netlify base directory to `frontend`, build command to `npm run build`, and publish directory to `dist`. Then set Render's `FRONTEND_URL` and `CORS_ORIGINS` to `https://weddingbingoun.netlify.app` and redeploy both sides.

## Production checklist

- Never commit `.env` or credentials.
- Use MongoDB Atlas rather than a local MongoDB address.
- Use a strong unique `JWT_SECRET` and admin password.
- Confirm `/health` returns HTTP 200.
- Confirm browser requests target the Render URL, never `localhost`.
- Confirm the frontend origin is present in `CORS_ORIGINS`.
- Configure ImageKit keys before using admin gallery uploads.
- Configure SMTP credentials before relying on inquiry emails.
- Test contact submission, admin login, gallery loading, service detail pages, and package rendering after deployment.
- Add the deployed domain to Google Search Console and submit `/sitemap.xml`.

## Performance and SEO included

The project now includes production metadata, canonical URL, Open Graph and Twitter tags, `robots.txt`, a sitemap, a web manifest, immutable asset caching, a backend health endpoint, production-safe API URL handling, CORS normalization, proxy awareness, and a non-development Node start command.
