import express from 'express';

export class App {
  server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(express.json())
  }
}