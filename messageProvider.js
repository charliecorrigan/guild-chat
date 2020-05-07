class MessageProvider {
  constructor(postgresClient, io) {
    this.postgresClient = postgresClient;
    this.io = io;
  }

  connect(data) {
    try {
      const { socketId, userName } = data;
      this.postgresClient.connectUser(socketId, userName);
    } catch (error) {
      // TODO
      console.log(error)
    }
  }

  async getMessages(query) {
    try {
      const messages = await this.postgresClient.getMessages(query);
      return messages;
    } catch (error) {
      // TODO
      console.log(error)
    }
  }

  async postMessage(data) {
    try {
      const { recipient } = data;

      const recipientSocketId = await this.postgresClient.getSocketIdByName(recipient);
      const message = await this.postgresClient.saveMessage(data);

      this.io.to(recipientSocketId).emit('chatMessage', message);
      return message;
    } catch (error) {
      // TODO
      console.log(error)
    }
  }
}

module.exports = MessageProvider
