# Harry Potter Character Management

This project contains a full-stack Harry Potter character management app.

## Structure

- `backend/` - Node.js/Express backend with MongoDB and JWT authentication
- `frontend/` - React + Vite frontend application
- `index.js` - legacy local Express app (not used for the MERN stack)

## Local development

Backend:
```powershell
cd backend
npm install
npm run dev
```

Frontend:
```powershell
cd frontend
npm install
npm run dev
```

## Deploying to GitHub

1. Initialize a Git repository:
```powershell
git init
```
2. Add files and commit:
```powershell
git add .
git commit -m "Initial commit"
```
3. Add the remote and push:
```powershell
git remote add origin https://github.com/Shaik-Ruhi/Harry_potter.git
git branch -M main
git push -u origin main
```

> If your repo uses `master` instead of `main`, replace the branch command accordingly.

## Notes

- Keep secret keys and MongoDB URI in `.env` files, which are ignored by Git.
- For production hosting, use a platform like Vercel/Netlify for frontend and Render/Railway for backend.

## GitHub Actions Deployment

### Frontend
A workflow is configured at `.github/workflows/deploy-frontend.yml` to build and publish the frontend to GitHub Pages.

### Backend
A workflow is configured at `.github/workflows/deploy-backend.yml` to trigger Render deployment with secrets:

- `RENDER_API_KEY`
- `RENDER_BACKEND_SERVICE_ID`

Render CLI deployment requires adding these secrets in the GitHub repository settings.

### Render setup
1. Create a Render web service for the backend using the repo `Shaik-Ruhi/Harry_potter`.
2. Copy the service ID from Render.
3. Add the GitHub secrets above.
4. Push to `main` and GitHub Actions will deploy the backend to Render.

### Frontend production env

- Set `VITE_API_URL` in your frontend host (Vercel/Netlify) to the backend URL (for example `https://your-backend.onrender.com`).
- This makes the frontend call the deployed backend instead of assuming `/api` is colocated with the frontend.
