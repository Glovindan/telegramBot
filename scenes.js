const {Scenes,  Markup, Telegraf} = require('telegraf');

const QUESTION = ["Сколько мне лет?","Какого цвета крокодил?(Например: синий)","Какой день недели самый последний"];
const ANSWER = ["22","Зеленый","Воскресенье"];
let counter = 0;
class SceneGenerator {
  GenAnswerScene () {
    const answer = new Scenes.BaseScene('answer');
    answer.use(Telegraf.log());

    answer.enter(async (ctx) => {
      await ctx.reply('Напиши мне ответ на вопрос или...',
        Markup.inlineKeyboard([
          Markup.button.callback('Не отвечать.','Deny')
        ]).oneTime().resize()
      )
      //Здесь выдать кнопку выйти
    })
    answer.action('Deny', async(ctx) => {
      await ctx.reply(`Что ж...`);
      await ctx.scene.enter('question');
    })

    answer.on('text', async(ctx) => {
      const text = ctx.message.text;
      if(text.toLowerCase() === ANSWER[counter].toLowerCase()) {
        await ctx.reply(`Правильно.`);
        counter++;
        await ctx.scene.enter('question')
      } else {
        await ctx.reply(`Не правильно.`);
        await ctx.scene.enter('question')
      }
    })

    return answer
  };

  GenQuestionScene () {
    const question = new Scenes.BaseScene('question');
    question.use(Telegraf.log());

    question.enter(async (ctx) => {
      if (counter === QUESTION.length) {
        await ctx.reply(`Ты ответил на все вопросы, поздравляю!`);
        await ctx.scene.leave();
      } else {
        await ctx.reply(QUESTION[counter],
          Markup.inlineKeyboard([
            Markup.button.callback('Ответить.','Answer')
          ])
        )
      }
    });

    question.action('Answer', (ctx) => ctx.scene.enter('answer'));
    return question
  }
}

module.exports = SceneGenerator;