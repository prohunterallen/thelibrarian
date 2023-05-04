<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## GUI API

[PostMan Collection](https://github.com/prohunterallen/thelibrarian/blob/main/TheLibrarian.postman_collection.json) download

## Running the app

```bash
# development
$ yarn run start NODE_ENV=development

# watch mode
$ yarn run start:dev NODE_ENV=development

```

## API Member Section

```bash
#Add Member
POST => /api/member/add
{
    "username": "test3",
    "password": "11111111",
    "name": "Jhone Doe",
    "email": "test2@test.com"
}

#Login Member
POST => /api/member/login
{
    "username": "test2",
    "password": "11111111"
}

#Show All Member filtering by pagination and keywords
GET => /api/member?keyword=<name||username||memberNo>&page=1&pageSize=10
#possible to searh all of Fullname, Username and Member Number

#Get Profile by ID
GET => /api/member/<id>

#Updat profile by ID
PUT => /api/member/<id>
{
    "name": "Rimuru Tempest",
    "email":"email@here.c"
}

#Update Password
PUT => /api/member/password/reset/<id>
{
    "current":"22222222",
    "new":"11111111",
    "confirm" : "11111111"
}

#Toggle Suspended Account
PUT => /api/member/<id>/suspended/toggle/

#Delete Member
DELETE => /api/member/delete/<id>
{
    "password":"11111111"
}

#Update Profile Images
PATCH => /api/member/<id>/profile-image
{
  "image": file.path
}

```

## API Books Section

```bash
#Get All books by conditions
GET =>/api/books/keyword=<title|isbn|author>?page=1&pageSize=10&orderby=stock&sorting=desc

#Add New Book
POST =>/api/books/add
{
  "title": "Harry Potter",
  "author": "JK Rowling",
  "isbn": "ISB123123123",
  "qrCode": "asdfasdfasdfasdf",
  "barcode": "123123123123",
  "price": 590.00,
  "stock": 10,
  "category": "novel"
}

```

## Requirement

- NestJS Microservice ✅
- MongoDB ✅
- Redis

#1.1 ออกแบบระบบร้านหนังสือ โดยมี service

- User Service
- Book Service

#1.2 ออกแบบ Features ของ User Service

- เพิ่ม / ลบ / แก้ไขข้อมูล User ✅
- แสดงรายการ User แบบ pagination ( สามารถ filter ตามชื่อผู้ใช้งาน , ชื่อ - นามสกุล ได้ ) ✅
- แสดงรายการ User สามารถแสดงจำนวนหนังสือทั้งหมดที่แต่ละ user ซื้อไปได้
- แสดงรายการ User สามารถแสดงวันที่ซื้อหนังสือล่าสุดของแต่ละ user ได้
- ระบบ Login (เมื่อมีการล็อคอินผิดพลาด 3 ครั้งจะถูกระงับ 10 วินาที)
- ระบบรายงานจำนวนสมาชิกใหม่
- ระบบรายงานจำนวนสมาชิกที่เข้าใช้ระบบ
- ระบบเปลี่ยน Password ✅
- Change Profile Image ✅
- JWT ✅
- ระงับการใช้งาน User ✅

#1.3 ออกแบบ Features ของ Book Service ดังนี้

- เพิ่ม ✅ / ลบ / แก้ไขข้อมูล Book
- แสดงหนังสือ ( filter ตามหมวดหมู่ , เรียงลำดับหนังสือที่เหลือมาก - น้อย , ราคาต่ำ - สูง ) ✅
- ระบบบันทึกการซื้อหนังสือของ user
- ระบบรายงานหนังสือที่ถูกขายในแต่ละหมวดหมู่ ,จัดอันดับหนังสือที่ถูกขายเยอะที่สุด , หนังสือที่ใกล้จะหมด
- ระบบจัดอันดับผู้ที่ซื้อหนังสือ จำนวนกี่เล่ม แบ่งเป็นหมวดหมู่ละกี่เล่ม ราคาเท่าไหร่
- User ที่ถูกระงับการใช้งานจะไม่สามารถซื้อหนังสือได้

#Optional

- Book's images cover or preview
- ระบบรายงานสามารถระบุวันเวลาที่ต้องการได้ หรือ เลือกเป็นรายวัน / เดือน / ปี
