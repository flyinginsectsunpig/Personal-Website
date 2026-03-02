# Zakhir Keane McKinnon | Magnum Opus Portfolio

Enterprise-style monorepo for an interactive portfolio platform that showcases:

- Frontend engineering with React + TypeScript
- Java/Spring Boot clean architecture and API design
- Python/FastAPI machine learning microservice with real predictions
- DevOps-ready Dockerized deployment model

## Monorepo Structure

```text
.
├── frontend/                 # React + TypeScript + Vite UI
├── backend-java/             # Spring Boot API (CRUD + layered architecture)
├── backend-ml-python/        # FastAPI ML microservice (scikit-learn)
├── backend-csharp/           # Optional C# service placeholder
├── docs/                     # Architecture + implementation notes
├── architecture-diagrams/    # Diagram assets
├── docker-compose.yml
└── website.html              # Existing standalone file preserved
```

## Quick Start (Docker)

```bash
docker compose up --build
```

Apps:

- Frontend: `http://localhost:5173`
- Java API: `http://localhost:8080`
- Java Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- ML API: `http://localhost:8000/docs`

## Local Dev

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Java Backend

```bash
cd backend-java
./mvnw spring-boot:run
```

### Python ML Service

```bash
cd backend-ml-python
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Engineering Notes

- Real ML logic is implemented in `backend-ml-python/app/ml_models.py`
- Java backend follows `Controller -> Service -> Repository` layering with DTOs
- Frontend includes interactive ML tab wired to live backend inference
