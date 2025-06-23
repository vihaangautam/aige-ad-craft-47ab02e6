# 🚀 AIGE Backend + Genkit Setup Instructions

## 📋 Prerequisites

1. **Docker & Docker Compose** installed
2. **Python 3.11+** for Genkit server
3. **Node.js 18+** for frontend
4. **Google API Key** for Gemini

## 🔧 Backend Setup

### 1. Install Dependencies

```bash
cd aige-backend
pip install -r requirements.txt
```

### 2. Configure Environment

Update your `.env` file with your Google API key:

```bash
# Add this line to aige-backend/.env
GOOGLE_API_KEY=your_actual_google_api_key_here
```

### 3. Run Database Migrations

```bash
# Start the database
docker-compose up db -d

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 4. Start Django Server

```bash
# Start full stack
docker-compose up

# OR start Django only (if DB already running)
python manage.py runserver 0.0.0.0:8000
```

## 🤖 Genkit Server Setup

### 1. Install Genkit

```bash
cd aige-backend
pip install google-genkit[gemini]
```

### 2. Start Genkit Server

```bash
# From aige-backend directory
python genkit_server.py
```

This will start the Genkit server on `http://localhost:3400`

## 🎨 Frontend Setup

### 1. Install Dependencies

```bash
# From project root
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Frontend will be available at `http://localhost:8080`

## 🧪 Testing the Integration

### 1. Test Authentication

1. Go to `http://localhost:8080/auth`
2. Create a user account or login
3. You should be redirected to the dashboard

### 2. Test Ad Configuration

1. Click "Create New Ad" → "Immersive Story AR"
2. Fill in the configuration form
3. Click "Next: Build Story Flow"

### 3. Test Flow Builder

1. Add scenes and choice points
2. Connect them with edges
3. Click "Save Flow"

### 4. Test Script Generation

1. After saving flow, click "Generate Script"
2. Check browser console for the generated script
3. Verify the API call goes to Django → Genkit

## 🔍 Verification Checklist

### Backend API Endpoints

- ✅ `POST /api/token/` - JWT login
- ✅ `POST /api/token/refresh/` - Token refresh
- ✅ `GET /api/scenes/` - List user scenes
- ✅ `POST /api/scenes/` - Create scene
- ✅ `GET /api/configs/` - List user configs
- ✅ `POST /api/configs/` - Create config
- ✅ `POST /api/generate-script/` - Generate script via Genkit

### Frontend Features

- ✅ Protected routes with authentication
- ✅ Token storage and refresh
- ✅ API calls with auth headers
- ✅ Ad configuration form
- ✅ Story flow builder
- ✅ Script generation trigger

### Genkit Integration

- ✅ Genkit server running on port 3400
- ✅ Django calls Genkit service
- ✅ Gemini model integration
- ✅ Structured prompt generation
- ✅ Error handling

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   pip install google-genkit[gemini]
   ```

2. **CORS errors**
   - Check Django CORS settings
   - Verify frontend URL in CORS_ALLOWED_ORIGINS

3. **Authentication errors**
   - Check JWT token in localStorage
   - Verify API endpoints are protected

4. **Genkit connection errors**
   - Ensure GOOGLE_API_KEY is set
   - Check Genkit server is running on port 3400

5. **Database connection errors**
   ```bash
   docker-compose down
   docker-compose up db -d
   python manage.py migrate
   ```

## 📊 API Testing with curl

### Login
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password"}'
```

### Create Config
```bash
curl -X POST http://localhost:8000/api/configs/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "theme_prompt": "Father and child in village",
    "tone": "emotional",
    "characters_or_elements": "Father, Child, Village",
    "enable_ar_filters": true,
    "include_mini_game": false
  }'
```

### Generate Script
```bash
curl -X POST http://localhost:8000/api/generate-script/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "config": {
      "theme_prompt": "Father and child in village",
      "tone": "emotional"
    },
    "flow": {
      "scenes": [
        {"title": "Opening", "description": "Father and child meet"}
      ]
    }
  }'
```

## 🎯 Next Steps

1. **Test the complete flow** from login to script generation
2. **Verify Genkit responses** are properly formatted
3. **Add error handling** for API failures
4. **Implement script preview** in the frontend
5. **Add script export** functionality

Your system should now be fully integrated with Genkit! 🎉