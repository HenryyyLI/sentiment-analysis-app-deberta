## Structure

---

- Backend: Python -- [Flask]([Welcome to Flask — Flask Documentation (3.2.x)](https://flask.palletsprojects.com/en/latest/))
- Data Base: [MongoDB]([Download MongoDB Community Server | MongoDB](https://www.mongodb.com/try/download/community))
- Front-end: [React]([Quick Start – React](https://react.dev/learn)), [Node]([Node.js — Download Node.js®](https://nodejs.org/en/download)), [SCSS]([Sass: Install Sass](https://sass-lang.com/install/)), [React Router]([Docs Home v6.28.1 | React Router](https://reactrouter.com/6.28.1/home))
- UI: [Material UI]([Overview - Material UI](https://mui.com/material-ui/getting-started/)), [ECharts]([Examples - Apache ECharts](https://echarts.apache.org/examples/en/index.html))

## Dependencies

---

- Make sure MongoDB is available on your PC

  - Download link 👉️https://www.mongodb.com/try/download/community

- Make sure Node is available on your PC

  - Download link 👉️https://nodejs.org/en/download

- Make sure yarn is available on your PC

  ```cmd
  npm install -g yarn
  ```

- Make sure scss is available on your PC

  ```cmd
  npm install -g sass
  ```

- Download dependencies with yarn

  ```cmd
  cd your path to MachineLearning APP/Front-end
  yarn   # This operation will create a new file named node_modules
  ```

- Make sure React is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to MachineLearning APP/Front-end
  npm install react react-dom   # install with Node
  yarn add react react-dom   # install with yarn
  ```

- Make sure React Router is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to MachineLearning APP/Front-end
  npm install react-router-dom   # install with Node
  yarn add react-router-dom   # install with yarn
  ```

- Make sure ECharts is available on your PC (may be already contained in the *node_modules* file)

  ```cmd
  cd your path to MachineLearning APP/Front-end
  npm install echarts echarts-wordcloud   # install with Node
  yarn add echarts echarts-wordcloud   # install with Node
  ```

## Usage

---

1. Run the server.py file to start server side

   ```cmd
   cd your path to MachineLearning APP/Backend
   python server.py
   ```

2. Run the client side with yarn

   ```cmd
   cd your path to MachineLearning APP/Front-end
   yarn start
   ```

