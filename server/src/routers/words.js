import app from '../index.js';
import wordsRoutes from '../database/controllers/words.js';

app.get('/topics', wordsRoutes.getTopics)

app.get('/allTopicWords', wordsRoutes.getAllTopicWords)

app.get('/words/:topic', wordsRoutes.getWords)

app.post('/newTopic', wordsRoutes.postNewTopic)

app.patch('/addNewWords', wordsRoutes.patchAddNewWords)