const { Scenes, session, Telegraf } = require('telegraf');
const config = require('config');
const bot = new Telegraf(config.get('Telegraf.token'));

const SceneGenerator = require('./scenes');
const curScene = new SceneGenerator();
const answerScene = curScene.GenAnswerScene();
const questionScene = curScene.GenQuestionScene();

const DB = require('./DataBase/db.js');
const dataBase = new DB();

const stage = new Scenes.Stage([answerScene, questionScene]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  const telegramId = ctx.message.from.id;
  const findUser = await dataBase.findUser(telegramId);
  if(!findUser) {
    await dataBase.setNewUser(telegramId);
  }
  
  await ctx.reply(`Вот ты и здесь, ${ctx.message.from.first_name}...`);
  await ctx.scene.enter('question');
})

bot.command('reset', async(ctx) => {
  const telegramId = ctx.message.from.id;
  const findUser = await dataBase.findUser(telegramId);
  if(findUser) {
    await dataBase.resetCounter(telegramId);
  };
  ctx.reply('Сброшено');
});

bot.launch().then(async (err,res) => {
  await dataBase.start();
  console.log('Started');
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))