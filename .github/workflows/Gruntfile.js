name: Node.js Grunt Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
      - name: ⬇️ Checkout code
        uses: actions/checkout@v3

      - name: 🟢 Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: 📦 Install dependencies
        run: npm install

      - name: 🔨 Run Grunt
        run: npx grunt
