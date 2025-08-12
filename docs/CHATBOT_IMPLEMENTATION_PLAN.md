# SmartPlanner Chatbot: Python & AI Implementation Plan

## Overview
This document outlines the architecture, technology stack, and implementation plan for integrating a context-aware AI chatbot (Aarya) into the SmartPlanner platform using Python and modern AI services. The chatbot will always operate with the current app context (e.g., "learning planner" inside "day planner") to provide relevant, personalized assistance.

---

## 1. High-Level Architecture

```
[React UI]
   |
   |  (REST/WebSocket)
   v
[Chatbot API Service (Python/FastAPI)]
   |
   |  (calls)
   v
[AI/NLP Service (Azure OpenAI, OpenAI API, or HuggingFace)]
   |
   |  (context, user data)
   v
[App Context Service / DB (CosmosDB, Redis)]
```

---

## 2. Technology Stack


- **Frontend:** React (existing, shared/ui-library)
- **Backend API:** Python (FastAPI or Flask)
- **AI/NLP:**
    - Azure AI Foundry (Azure AI Studio) [Recommended for enterprise, supports GPT-4, Llama, etc.]
    - Azure OpenAI Service
    - OpenAI API
    - HuggingFace Transformers
- **Context Storage:** Azure Cosmos DB (user/session context), Redis (optional for fast session state)
- **Authentication:** OAuth/JWT (existing)
- **Deployment:** Azure Functions (Python), Azure App Service, or Docker container
---

## 10. Using Azure AI Foundry (Azure AI Studio) for LLM Integration

### Overview
Azure AI Foundry (now part of Azure AI Studio) allows you to deploy and use large language models (LLMs) like GPT-4, Llama, and more, with enterprise security, compliance, and integration with other Azure services.

### Steps to Integrate Azure AI Foundry

#### 1. Prerequisites
- Azure account (free or paid)
- Contributor access to an Azure subscription

#### 2. Deploy a Model in Azure AI Studio/Foundry
1. Go to [Azure AI Studio](https://ai.azure.com/) or search for "Azure AI Studio" in the Azure Portal.
2. Create a new Project or Foundry Workspace.
3. Deploy a model (e.g., GPT-4, Llama, or other available LLMs).
   - Choose a model, give your deployment a name, and select a pricing tier.
   - Wait for deployment to complete.

#### 3. Get Your Endpoint and API Key
- In your deployed model’s overview, find the “Endpoint” URL.
- Go to “Keys and Endpoint” to get your API key.

#### 4. Call the Model from Python
Install the requests library if you haven’t:
```
pip install requests
```

Example code to call your Azure Foundry model:
```python
import requests
import os

endpoint = os.getenv("AZURE_FOUNDRY_ENDPOINT")  # e.g., "https://<your-resource>.openai.azure.com/openai/deployments/<deployment-name>/chat/completions?api-version=2024-02-15-preview"
api_key = os.getenv("AZURE_FOUNDRY_KEY")

def call_azure_foundry(prompt):
    headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
    }
    data = {
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    }
    response = requests.post(endpoint, headers=headers, json=data)
    return response.json()["choices"][0]["message"]["content"]
```

#### 5. Integrate with Your FastAPI /chat Endpoint
Call `call_azure_foundry()` inside your `/chat` endpoint and return the result.

#### 6. Learn More
- [Azure AI Studio Documentation](https://learn.microsoft.com/en-us/azure/ai-studio/)
- [Azure OpenAI Service Quickstart](https://learn.microsoft.com/en-us/azure/ai-services/openai/quickstart)

---

---

## 3. Context Management Strategy

### a. Context Model
- **Session Context:** Stores current app/module (e.g., day planner, finance, travel), sub-module (e.g., learning planner), and user state.
- **User Profile:** Preferences, recent actions, goals, and permissions.
- **Short-Term Memory:** Last N messages/interactions for continuity.
- **Long-Term Memory:** Key user data, plans, and history (queried as needed).

### b. Context Flow
1. **Frontend** sends user message + current app context (e.g., `{module: 'day', submodule: 'learning', ...}`) to backend.
2. **Backend** enriches context with user profile and recent history from DB.
3. **AI Service** receives message + context, generates a response tailored to the current app/module.
4. **Backend** may trigger business logic (e.g., fetch tasks, create reminders) based on intent.
5. **Response** is returned to frontend and context is updated in DB.

### c. Context Storage
- Use Cosmos DB for persistent user/session context.
- Use Redis (optional) for fast, ephemeral session state.
- Pass context as part of every chat API call for stateless scaling.

---

## 4. Implementation Steps

### Step 1: API Service (Python)
- Create a FastAPI app with `/chat` endpoint.
- Accepts: `{user_id, message, context}`
- Authenticates user (JWT/OAuth).
- Loads user/session context from Cosmos DB.
- Calls AI/NLP service with message + context.
- Handles special intents (e.g., fetch tasks, add event) by calling internal APIs.
- Returns AI response + any action results.

### Step 2: AI/NLP Integration
- Integrate with Azure OpenAI (preferred for enterprise), OpenAI API, or HuggingFace.
- Prompt engineering: Always include current app/module context in the prompt.
- Example prompt:
  ```
  You are Aarya, an AI assistant for SmartPlanner. The user is currently using the [Learning Planner] inside the [Day Planner] module. Respond helpfully and contextually.
  User: {message}
  Context: {context_json}
  ```
- Optionally, use function calling (OpenAI) to trigger backend actions.

### Step 3: Context Management
- Define context schema: `{user_id, module, submodule, recent_actions, preferences, ...}`
- Store/update context in Cosmos DB after each interaction.
- Retrieve and pass context on every chat request.

### Step 4: Frontend Integration
- Update chat UI to send current app/module context with every message.
- Display AI responses and handle quick actions.

### Step 5: Business Logic Integration
- For actionable intents (e.g., "Show my tasks"), backend triggers business logic or microservices.
- Return results alongside AI response.

### Step 6: Security & Monitoring
- Secure API with OAuth/JWT.
- Log all interactions for analytics and debugging.
- Monitor usage and performance.

---python -m venv venv

## 5. Advanced Context Handling (Recommended)
- Use a context manager class in Python to merge frontend context, user profile, and recent history.
- Implement context pruning (limit size for AI prompt efficiency).
- For multi-turn conversations, maintain a rolling window of recent messages.
- For cross-module actions (e.g., "Add this to my travel plan"), allow context switching and confirmation.

---

## 6. Example: Python FastAPI Chat Endpoint

```python
from fastapi import FastAPI, Request, Depends
from pydantic import BaseModel
import openai

app = FastAPI()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    context: dict

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    # 1. Load user/session context from DB (pseudo-code)
    # context = load_context(req.user_id)
    # 2. Merge with incoming context
    # 3. Call OpenAI with prompt
    prompt = f"""
    You are Aarya, an AI assistant for SmartPlanner. The user is currently using the [{req.context.get('submodule')}] inside the [{req.context.get('module')}] module. Respond helpfully and contextually.\nUser: {req.message}\nContext: {req.context}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role": "system", "content": prompt}]
    )
    # 4. Save updated context
    # save_context(req.user_id, updated_context)
    return {"response": response['choices'][0]['message']['content']}
```

---

## 7. Benefits of This Approach
- **Always Contextual:** Chatbot responses are always relevant to the user's current app/module.
- **Scalable:** Stateless API, context passed per request, easy to scale horizontally.
- **Extensible:** Add new modules, business logic, or AI models as needed.
- **Secure:** OAuth/JWT, no sensitive data in prompts.

---

## 8. Future Enhancements
- Add voice input/output.
- Integrate with calendar, email, or external productivity tools.
- Use RAG (Retrieval Augmented Generation) for deeper knowledge integration.
- Personalize AI with user goals, habits, and feedback.

---

## 9. References
- [Azure OpenAI Service](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Cosmos DB Python SDK](https://learn.microsoft.com/en-us/azure/cosmos-db/sql/sql-api-sdk-python)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)

---

**This plan ensures your chatbot is always aware of the user's current context, is scalable, and is easy to extend as your app grows.**
