class PostgresClient {
  constructor(pool) {
    this.pool = pool;
  }

  async connectUser(socketId, userName) {
    const findUserQuery = 'SELECT * FROM users WHERE username =$1 LIMIT(1);'
    const updateUserQuery = `UPDATE users SET socketId =$1 WHERE userName =$2 RETURNING *;`
    const createUserQuery = `INSERT INTO users (socketId, username) VALUES ($1, $2) RETURNING *;`
    try {
      const user = await this.pool.query(findUserQuery, [userName]);
      const connectQuery = user.rows.length > 0 ? updateUserQuery : createUserQuery;

      const connectedUser = await this.pool.query(connectQuery,[socketId, userName]);
      return connectedUser.rows;
    } catch (error) {
      // TODO
      console.log(error)
    }
  }

  async getMessages(query) {
    try {
      let result;
      let messageQuery = 'SELECT * FROM messages'
      let withUserModifier = ' WHERE recipient=$1 AND sender=$2'
      const dateModifier = "datesent > (CURRENT_DATE - INTERVAL '30 days');";
      const qtyModifier = " LIMIT(100);";
      const { recipient, sender, limitBy } = query;

      if (recipient && sender) {
        const limitModifier = limitBy === "date" ? ' AND ' + dateModifier : qtyModifier;
        messageQuery += withUserModifier + limitModifier;
        result = await this.pool.query(messageQuery, [recipient, sender])
      } else {
        const limitModifier = limitBy === "date" ? ' WHERE ' + dateModifier : qtyModifier;
        messageQuery += limitModifier;
        result = await this.pool.query(messageQuery)
      }

      return result.rows;
    } catch (error) {
      // TODO
      console.log(error)
    }
  }

  async getSocketIdByName(userName) {
    try {
      const getSocketIdByNameQuery = "SELECT socketid FROM users WHERE username =$1 LIMIT(1);"
      const result = await this.pool.query(getSocketIdByNameQuery, [userName]);

      return result.rows[0] && result.rows[0]['socketid'] || null;
    } catch (error) {
      // TODO
      console.log(error)
    }
  }

  async saveMessage(message) {
    try {
      const { content, sender, recipient } = message;
      const insertMessageQuery = "INSERT INTO messages (content, sender, recipient)VALUES($1, $2, $3) RETURNING *"
      const result = await this.pool.query(insertMessageQuery, [content, sender, recipient]);

      return result.rows[0];
    } catch (error) {
      // TODO
      console.log(error);
    }
  }
}

module.exports = PostgresClient
