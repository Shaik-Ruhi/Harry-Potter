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
