const express = require('express')
const { pool } = require('../config')
const app = express()

const http = require('http').Server(app);
const io = require('socket.io')(http);

const PostgresClient = require('../postgresClient');
const MessageProvider = require('../messageProvider');

jest.mock('../postgresClient');
// how to mock socket.io?

beforeEach(() => {
  PostgresClient.mockClear();
});

describe('MessageProvider tests', () => {
  it('given valid inputs calls postgresClient', () => {
    const pgClient = new PostgresClient(pool);
    const messageProvider = new MessageProvider(pgClient, io);
    messageProvider.connect({ socketId: "foo", userName: "bar" });
    expect(PostgresClient).toHaveBeenCalledTimes(1);
  });
})
