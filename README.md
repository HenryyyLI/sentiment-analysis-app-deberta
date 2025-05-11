# 🤖 DeBERTa Sentiment-Analysis App

A full-stack sentiment-analytics platform that blends state-of-the-art DeBERTa language modelling with an interactive React dashboard. Tailored for financial news, the app distills sentiment from articles into keyword-driven word clouds and time-based trends—transforming unstructured content into clear signals for smarter investment decisions.

## 🔍 Key Features

- **🧠 Finance-Tuned DeBERTa Model**

  Fine-tuned on domain-specific corpora, the `deberta-v3-large` model delivers high-accuracy sentiment classification on financial news content—capturing nuanced emotional tone across headlines and long-form articles alike.

- **🖥️ Full-Stack Modular Architecture**

  Built with React (frontend), Flask (backend), and MongoDB (database) to ensure fast performance, persistent data handling, and reliable support for real-time analysis workflows.

- **🌥️ LIME-Guided Sentiment Word Cloud**

  Highlights key terms from input text with polarity-based coloring in an interactive word cloud, using LIME to determine the most influential tokens—offering a clear, visual distillation of emotional tone, lexical emphasis, and the sentiment-laden language that defines each piece.

- **📈 Sentiment Timeline & History Tracking**

  Automatically logs each prediction with timestamped records, allowing users to monitor sentiment changes over time and identify trend shifts that may signal market movement.

- **🎛️ Minimal, Focused UI Design**

  The application features a streamlined layout with responsive components and polished visual hierarchy—keeping the interface clean, distraction-free, and optimized for real-world use.

## 📁 Project Structure

```bash
sentiment-analysis-app/
├── Backend/                     # Backend service built with Flask
│   ├── server.py                # Main entry point; defines API endpoints
│   ├── sentModel.py             # Loads DeBERTa model and handles inference logic
│   └── mongo_db.py              # Handles MongoDB connection and sentiment result storage
├── Front-end/                   # React-based frontend application
│   ├── public/                  # Static assets and HTML template
│   ├── src/                     
│   │   ├── components/          # Reusable UI components (e.g., charts, inputs)
│   │   ├── pages/               # Page-level views rendered by routes
│   │   ├── App.js               # Application root; sets up routing and layout
│   │   ├── AppContext.js        # React context for global state management
│   │   └── ...                  # Other frontend modules and logic
│   └── package.json             # Frontend dependencies, scripts, and metadata
├── README.md                    # Project overview and usage instructions
└── .gitignore                   # Specifies untracked files to ignore in Git
```

## 🛠 Tech Stack

- **NLP / Model**: 🤗 Transformers `deberta-v3-large`, Python — `PyTorch`, `Lime`, etc.
- **Backend**: Python — `Flask`
- **Database**: `MongoDB`

- **Frontend**: `React`, `Node.js`, `SCSS`, `React Router`

- **UI & Visualization**: `Material UI`, `ECharts`

## ⚙️ Dependencies

- **MongoDB** – Required for data storage
  👉 [Download MongoDB](https://www.mongodb.com/try/download/community)

- **Node.js** – Required for running the frontend and installing packages
  👉 [Download Node.js](https://nodejs.org/en/download)

- **Yarn** – Package manager (alternative to npm)

  ```bash
  npm install -g yarn
  ```

- **Sass (SCSS)** – For styling components

  ```bash
  npm install -g sass
  ```

- **React & Core Libraries** –  For building UI (if not already in `node_modules`)

  ```bash
  yarn add react react-dom
  ```

- **React Router** – For client-side routing (if not already in `node_modules`)

  ```bash
  yarn add react-router-dom
  ```

- **Echarts** – For data visualization (if not already in `node_modules`)

  ```bash
  yarn add echarts echarts-wordcloud
  ```

## 🚀 Setup & Usage

1. **Clone the repository**

   ```bash
   git clone https://github.com/HenryyyLI/sentiment-analysis-app-deberta.git
   cd sentiment-analysis-app-deberta
   ```

2. **Start the backend server**

   ```bash
   cd backend
   python server.py
   ```

3. **Start the frontend application**

   ```bash
   cd frontend
   yarn install
   yarn start
   ```
