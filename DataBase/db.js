const config = require("config");
const mongoose = require("mongoose");
const Users = require("./models/Users");
const Questions = require("./models/Questions");

class DB {
  async start() {
    try {
      await mongoose.connect(config.get('MongoDB.mongoURI'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log(`Connected`);
    } catch(e) {
      console.log('Server Error', e.message);
      process.exit(1);
    }
  }

  async setNewUser(telegramId) {
    const user = new Users({telegramId: telegramId, counter: 0});
    await user.save();
    return user;
  }

  async findUser(telegramId) {
    const user = await Users.findOne({telegramId: telegramId.toString()});
    return user;
  }

  async increaseCounter(telegramId) {
    const user = await this.findUser(telegramId);
    user.counter++;
    await user.save();
  }

  async resetCounter(telegramId) {
    const user = await this.findUser(telegramId);
    user.counter = 0;
    await user.save();
  }

  async getQuestionsCount() {
    const count = await Questions.countDocuments((err, res) => {
      return res;
    })
    return count;
  }

  async getQuestion(counter) {
    const question = await Questions.findOne({questionId: counter.toString()});
    return question;
  }
}

module.exports = DB;