# Architecture Overview

## System Components

1. `frontend` (React/TypeScript): UX, data visualization, code/architecture panels.
2. `backend-java` (Spring Boot): enterprise CRUD, DTO mapping, API patterns.
3. `backend-ml-python` (FastAPI): ML training + inference endpoints.
4. `backend-csharp` (optional): reserved for ABP/.NET showcase integration.

## Request Flow

1. User interacts with ML playground.
2. React posts payload to FastAPI `/api/v1/ml/*`.
3. FastAPI runs inference on trained scikit-learn model.
4. Response renders prediction + metrics in UI.

## Java Clean Architecture Pattern

- Controllers: request validation + response handling.
- Services: business logic + DTO orchestration.
- Repositories: persistence abstraction.
