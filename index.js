const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
const axios = require("axios");
const Projects = require("./MiddleWares/Projects");
const Links = require("./MiddleWares/SocialLink");
// !---------------------------------

// dotenv.config({ path: "./Config/config.env" });
dotenv.config();
const ShahidALT_Bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// !---------------------------------
// TODO : for /start
ShahidALT_Bot.onText(/\/start/, (message) => {
  try {
    const chatID = message.from.id;
    ShahidALT_Bot.sendMessage(
      chatID,
      `hello ${message.from.first_name} ${message.from.last_name} how may i help you?`
    );
  } catch (error) {
    console.log(error.message);
  }
});

// TODO : for /for menu
ShahidALT_Bot.onText(/\/menu/, (message) => {
  try {
    const chatID = message.from.id;
    MenuList =
      "1. /MyRepository \n2. /projects \n3. /socail_links \n4. /dictionary";
    ShahidALT_Bot.sendMessage(chatID, MenuList);
  } catch (error) {
    console.log(error.message);
  }
});

// TODO : for /Repositories
ShahidALT_Bot.onText(/\MyRepository/, async (message) => {
  try {
    const chatID = message.from.id;

    ShahidALT_Bot.sendChatAction(chatID, "typing");

    let api_url =
      "https://api.github.com/users/mohammedshahid096/repos?per_page=100";

    const { data } = await axios.get(api_url);

    let getData = data.map((item, index) =>
      item.html_url.replace(
        "https://github.com/mohammedshahid096/",
        `${index + 1}. `
      )
    );
    getData = getData.toString();
    getData = getData.replaceAll(",", "\n");
    let response = "---All Repositories--- \n\n" + getData;
    ShahidALT_Bot.sendMessage(chatID, response);
    ShahidALT_Bot.sendMessage(chatID, "response : /repo Choice_number");
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/repo (.+)/, async (msg, match) => {
  try {
    const chatID = msg.from.id;
    ShahidALT_Bot.sendChatAction(chatID, "typing");

    let choiceSelection = match[1];

    choiceSelection = parseInt(choiceSelection);
    choiceSelection = choiceSelection - 1;

    let api_url =
      "https://api.github.com/users/mohammedshahid096/repos?per_page=100";

    const { data } = await axios.get(api_url);
    const link = data[choiceSelection].html_url;

    ShahidALT_Bot.sendMessage(chatID, link);
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/dictionary/, (message) => {
  try {
    const chatID = message.from.id;
    let m =
      "<b>Hi Am a Dictionary \nsearch.... in this way</b> \n\n example : \n/Dict amazing";
    ShahidALT_Bot.sendMessage(chatID, m, { parse_mode: "HTML" });
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/Dict (.+)/, async (msg, match) => {
  try {
    const chatID = msg.from.id;
    ShahidALT_Bot.sendChatAction(chatID, "typing");
    let choiceSelection = match[1];
    const search_url = `https://api.dictionaryapi.dev/api/v2/entries/en/${choiceSelection}`;
    const { data } = await axios.get(search_url);
    let word = data[0].word;
    let partOfSpeech = data[0].meanings[0].partOfSpeech;
    let definition = data[0].meanings[0].definitions[0].definition;
    let synonyms = data[0].meanings[0].synonyms.toString();

    const details = `<b>Word :</b> ${word} \n<b>parts of speech : </b> ${partOfSpeech} \n<b>Definition : </b> ${definition} \n <b>Synonyms : </b> ${synonyms}`;

    ShahidALT_Bot.sendMessage(chatID, details, { parse_mode: "HTML" });
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/socail_links/, (message) => {
  try {
    const chatID = message.from.id;

    let html = "<b>------All Socail Link------</b> \n\n";
    for (let item in Links) {
      html += `<b>${item}</b> : ${Links[item]} \n\n`;
    }

    ShahidALT_Bot.sendMessage(chatID, html, { parse_mode: "HTML" });
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/projects/, (message) => {
  const chatID = message.from.id;
  try {
    let reply = "";
    for (let item in Projects) {
      reply += "" + "<b>" + item + "</b>" + ". " + Projects[item].name + "\n";
    }

    ShahidALT_Bot.sendMessage(chatID, reply, { parse_mode: "HTML" });
    ShahidALT_Bot.sendMessage(
      chatID,
      "<b>send the message in this format :</b> \n\n/project your_option",
      { parse_mode: "HTML" }
    );
  } catch (error) {
    ShahidALT_Bot.sendMessage(chatID, errorText, { parse_mode: "HTML" });
    // console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\/project (.+)/, (message, match) => {
  try {
    const chatID = message.from.id;
    ShahidALT_Bot.sendChatAction(chatID, "typing");
    let choiceSelection = match[1];
    choiceSelection = parseInt(choiceSelection);
    const link = Projects[choiceSelection].url;
    ShahidALT_Bot.sendMessage(chatID, link);
  } catch (error) {
    console.log(error.message);
  }
});

ShahidALT_Bot.onText(/\Repository (.+)/, async (message, match) => {
  try {
    const chatID = message.from.id;

    ShahidALT_Bot.sendChatAction(chatID, "typing");
    let username = match[1];

    let api_url = `https://api.github.com/users/${username}/repos?per_page=100`;

    let data;
    try {
      const response = await axios.get(api_url);
      data = response.data;
    } catch (error) {
      let html = `${username} Repository not found`;
      ShahidALT_Bot.sendMessage(chatID, html);
      return;
    }

    let getData = data.map((item, index) =>
      item.html_url.replace(`https://github.com/${username}/`, `${index + 1}. `)
    );
    getData = getData.toString();
    getData = getData.replaceAll(",", "\n");
    let response = `---${username} Repositories--- \n\n` + getData;
    ShahidALT_Bot.sendMessage(chatID, response);
  } catch (error) {
    console.log(error.message);
  }
});

console.log("Telegram Bot server is started");
