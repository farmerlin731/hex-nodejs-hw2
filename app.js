const http = require('http');
const errorHandler = require('./service/errorHandler');
const successHandler = require('./service/successHandler');
const headers = require('./service/headers');
const mongoose = require('mongoose');
const Posts = require('./model/posts');
const dotenv = require('dotenv');


dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);
mongoose
    .connect(DB)
    // .connect('mongodb://localhost:27017/post0529')
    .then(() => console.log('Connect success._farmer'));

const reqListener = async (req, res) => {

    let body = "";
    req.on('data', (chunk) => {
        body += chunk;
    });


    if (req.url == '/posts' && req.method == 'GET') {
        const allPosts = await Posts.find();
        successHandler(res, allPosts);
    } else if (req.url == '/posts' && req.method == "POST") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (data.content) {
                    const newPost = await Posts.create({
                        name: data.name,
                        content: data.content,
                        tags: data.tags,
                        type: data.type
                    })
                    successHandler(res, newPost)
                } else {
                    errorHandler(res);
                }
            } catch (err) {
                errorHandler(res, err);
            }
        });
    } else if (req.url == '/posts' && req.method == "DELETE") {
        await Posts.deleteMany({}); //刪除全部
        successHandler(res, []);
    }
    else if (req.url.startsWith('/posts/') && req.method == "DELETE") {
        const delId = req.url.split('/').pop();
        try {
            await Posts.findByIdAndDelete(delId); // 刪除單筆
            successHandler(res, null);
        } catch (err) {
            errorHandler(res, err);
        }
    } else if (req.url.startsWith('/posts/') && req.method == "PATCH") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const patchId = req.url.split('/').pop();
                // console.log("in update", patchId);
                await PostsfindByIdAndUpdate(patchId, data); // 更新單筆
                successHandler(res, data);
            } catch (err) {
                errorHandler(res, err);
            }
        });
    }
    else if (req.method == 'OPTIONS') {
        res.writeHead(200, headers);
        res.end();
    }
    else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "failure",
            "message": "Router Error."
        }));
        res.end();
    }
}

const server = http.createServer(reqListener);

server.listen(process.env.PORT);