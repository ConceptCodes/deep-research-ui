# Deep Research UI

A browser-based application for conducting AI-powered research using LangGraph, allowing users to manage projects, configure settings, and view generated reports locally.


https://github.com/user-attachments/assets/d567e732-519e-45f4-b8d3-87cfec597c57


## Key Features

*   **Create Research Projects:** Define a main topic and related sub-topics for research.
*   **Local API Key Management:** Securely store your OpenAI and Tavily API keys in the browser's local storage via the Settings modal.
*   **Model Selection:** Choose between different AI models (e.g., GPT-4o Mini, GPT-4o) for research generation.
*   **Configurable Research:** Set parameters like the maximum number of research loops.
*   **AI-Powered Research:** Utilizes a LangGraph agent ([`src/lib/deep-research/agent/graph.ts`](src/lib/deep-research/agent/graph.ts)) to perform multi-step research:
    *   Generates a research plan.
    *   Conducts web searches (using Tavily).
    *   Writes and refines sections based on search results.
    *   Compiles a final report.
*   **Real-time Status & Event Log:** Monitor the research progress (Pending, In Progress, Completed, Failed) and view detailed logs of the agent's steps.
*   **View & Export Results:** Read the generated research summary directly in the app (rendered from Markdown) and download the full report as a `.md` file.
*   **Project Management:** View, manage, and delete past research projects.

## Technology Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS with shadcn/ui components
*   **State Management:** Zustand (with persistence to local storage)
*   **AI Orchestration:** LangChain.js / LangGraph (`@langchain/langgraph/web`)
*   **HTTP Client:** Axios (for Tavily API calls)
*   **Build/Runtime:** Node.js / Bun 

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended) or Bun
*   A package manager (npm, yarn, pnpm, or bun)
*   OpenAI API Key
*   Tavily Search API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/conceptcodes/deep-research-ui.git
    cd deep-research-ui
    ```
2.  Install dependencies:
    ```bash
    bun install
    ```

### Running the Development Server

1.  Start the development server:
    ```bash
    bun run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.


### Running in Langgraph Studio
1. Start Langgraph Studio:
```bash
bun run langgraph
```
2. Open [https://smith.langchain.com/studio?baseUrl=http://localhost:2024](https://smith.langchain.com/studio?baseUrl=http://localhost:2024) in your browser.

## Configuration

*   **API Keys:** Before creating research, click the "Set API Keys" button on the dashboard. Enter your OpenAI and Tavily API keys. These are stored *only* in your browser's local storage and are required for the research agent to function.

## How It Works

The application uses a LangGraph agent defined in [`src/lib/deep-research/agent/graph.ts`](src/lib/deep-research/agent/graph.ts) to automate the research process. When you create and generate a project:

1.  The UI triggers the LangGraph agent with your topic, sub-topics, and configuration.
2.  The agent plans the research, generates search queries, uses the Tavily API for web searches, and employs an OpenAI model to write and refine report sections.
3.  The UI subscribes to updates from the agent (via Zustand state) to display the real-time event log and final report content.

*(See [Deep Researcher Module](https://github.com/ConceptCodes/langgraph-scratchpad-js/blob/main/src/research/README.md) for more details on the agent's internal architecture).*

### Roadmap
- [ ] Add the quiz and review module
- [ ] add a graph visualization during research generation
