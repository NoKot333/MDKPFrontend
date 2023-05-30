import supertest from "supertest";
import chai from 'chai'
import app from "../index.js"

const expect = chai.expect;

it("Hello world! Connection to Server",function(done) {
    supertest(app)
    .get("/").expect(200).end(done);
})

it("Must return posts",function(done) {
    this.timeout(4000);
    supertest(app)
    .get("/posts").expect(200).end(done);
})

it("Login",function(done) {
    supertest(app)
    .post("/auth/login").send({
        "email":"nikitaopsin@gmail.com",
        "password":"123"
    }).end((err,res) => {
        if(err) return done(err);
        expect(res.body._id).equal("647027a4b1b7daff91ed5290")
        expect(res.body.fullName).equal("Никита Опшин")
        expect(res.body.email).equal("nikitaopsin@gmail.com")
        expect(res.body.isModerator).equal(false)
        expect(res.body.createdAt).equal("2023-05-26T03:29:40.861Z")
        expect(res.body.updatedAt).equal("2023-05-26T03:31:04.070Z")
        expect(res.body.avatarUrl).equal("/uploads/Ð¡Ð½Ð¸Ð¼Ð¾Ðº ÑÐºÑÐ°Ð½Ð° 2023-03-14 145412.png")
        expect(res.body.__v).equal(0)
        done();
    }
    )})
    it("Must return the ONE post",function(done) {
        supertest(app)
        .get("/posts/646ed7cbbaf114fd88cb67c7").expect(200).end((err,res) => {
            if(err) return done(err);
            expect(res.body.title).equal("Вопросы не по теме")
            expect(res.body.text).equal("А вы любите видеоигры?")
            done();
        }
        );
    })

    it("Must return all last tags",function(done) {
        supertest(app)
        .get("/tags").expect([
            "только",
            "новый",
            "пост",
            "страх",
            "любовь"
        ]).end(done)
    }
        );
        it("Must return error about email in register",function(done) {
            supertest(app)
            .post("/auth/register")
            .send({"email":"somenotmail",
                "password":"1234",
                "fullName":"Человек Разумный"}).expect([
                    {
                        "type": "field",
                        "value": "somenotmail",
                        "msg": "Неверный формат почты",
                        "path": "email",
                        "location": "body"
                    }
                ]).end(done)
        }
            );
            it("Must return error about name in register",function(done) {
                supertest(app)
                .post("/auth/register")
                .send({"email":"somemail@mail.ru",
                    "password":"123",
                    "fullName":"Ч"}).expect([
                        {
                            "type": "field",
                            "msg": "Имя должно содержать минимум 2 символа",
                            "value": "Ч",
                            "path": "fullName",
                            "location": "body"
                        }
                    ]).end(done)
            }
                );
                it("Must return error about name in register",function(done) {
                    supertest(app)
                    .post("/auth/register")
                    .send({"email":"somemail@mail.ru",
                        "password":"1",
                        "fullName":"Человек Разумный"}).expect([
                            {
                                "type": "field",
                                "value": "1",
                                "msg": "Пароль должен содержать как минимум 3 символа",
                                "path": "password",
                                "location": "body"
                            }
                        ]).end(done)
                }
                    );
                    it("Must return me",function(done) {
                        supertest(app)
                        .get("/auth/me")
                        .set('Authorization',`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDcwMjdhNGIxYjdkYWZmOTFlZDUyOTAiLCJpYXQiOjE2ODU0MjA5ODMsImV4cCI6MTY4ODAxMjk4M30.WRTE0GDK-2rwz6Dr3BZY-RzbQmi6AwRNh7lZZbXOXpM`)
                        .end((err,res) => {
                            if(err) return done(err);
                            expect(res.body.email).equal("nikitaopsin@gmail.com")
                            done();
                        }
                        );
                    })
                    it("Must return user by link",function(done) {
                        supertest(app)
                        .get("/user/647027a4b1b7daff91ed5290")
                        .end((err,res) => {
                            if(err) return done(err);
                            expect(res.body.email).equal("nikitaopsin@gmail.com")
                            done();
                        }
                        );
                    })