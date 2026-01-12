# AIGE AdCraft – AI-Powered Interactive Ad Generation Platform

**AIGE AdCraft** is a Software-as-a-Service (SaaS) platform that empowers brands, creators, and marketers to rapidly generate interactive, AI-powered video advertisements. The system supports prompt-driven scripting, dynamic storytelling templates, and real-time preview of mobile-optimized ad formats.

---

## Overview

AIGE AdCraft simplifies ad creation through a guided interface where users define the theme, tone, characters, and visual assets of their story. The platform leverages AI models to generate scripts, configures interactive story flows, and provides instant ad previews with branching logic, culminating in a poster-based promotional output with QR access.

---

## Key Features

- **AI Script Generation**: Uses prompt + tone + characters to produce dynamic video ad scripts using Gemini or GPT models.
- **Interactive Story Builder**: Visual flow editor for defining branching or linear ad narratives.
- **Template Switching**: Automatically adapts to AIGE or Choice Point structure based on selected config.
- **Video Ad Preview**: Mobile-first video interface (9:16) with real-time interaction flow.
- **Poster & QR Code Generation**: Final page includes download-ready promotional image.
- **Fully Dockerized Backend**: Supports local or cloud deployment with Django and PostgreSQL.

---

## Tech Stack

### Frontend

- **Framework**: React 18 (Vite)
- **UI**: Tailwind CSS + ShadCN + Lucide Icons
- **State Management**: React Context API
- **Routing**: React Router
- **Interactive Player**: Custom 9:16 video logic with branching control

### Backend

- **Framework**: Django 5.2
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL (Docker containerized)
- **Asynchronous (Planned)**: Celery with Redis
- **AI Integration**: Gemini/GPT-based prompt-to-script pipeline
- **Storage (Planned)**: Google Cloud Storage (GCS) for asset hosting

---


## API Endpoints
Method	Endpoint	              Description
POST	  /api/generate-script/	  Generate script from user config
GET	    /api/get-latest-script/	Fetch the latest generated script
POST	  /api/token/	            Auth token for login
GET    	/api/status/	          Health check / status


## Templates
### AIGE Template (Linear)
Scene → Choice Point → Scene A/B → Shared Game → Final Scene

### Choice Point Template (Branching)
Opening → Choice → Scene A or Scene B → Final Scene

Selection is driven by:
"template_type": "aige" | "choice_point"




