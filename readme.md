tes coba

log in 
/ -> nambah user

halaman 

/service nampilin seluruh service tersedia
/service/:id/detail
/user/:id/service -> nampilin semua service yang dibuat user

/user/:id ->profile user untuk halaman nambah service, delete edit
/user/:id/add -> nambah service jadi (half) /+ addService 
/user/:id/delete -> delete service

tambahan 

/signin -> daftar (done)
/login -> masuk (done)
/signout -> keluar 
/user -> daftar user (done)
/user/:id/delete


/user/:id/edit -> edit service
<!-- /service/:id/detail/:userId -->


setup model 

npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,role:string
npx sequelize-cli model:generate --name Service --attributes name:string,description:text,price:integer,imageUrl:string
npx sequelize-cli model:generate --name Detail --attributes status:boolean,requirement:text,availibility:string,timeOfContract:string
npx sequelize-cli model:generate --name Category --attributes name:string
npx sequelize-cli model:generate --name Galery --attributes name:string,alternate:string

npx sequelize-cli migration:create --name add-UserId-to-Services
npx sequelize-cli migration:create --name add-ServiceId-to-Details
npx sequelize-cli migration:create --name add-CategoryId-to-Services
npx sequelize-cli migration:create --name add-DetailId-to-Galeries


===== deploy heroku =====

--- udah ngerjain dii github ---
0. install CLI > https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
1. heroku login
2. heroku create <alamatWeb>
2a. (cek git) > git remote -v
3. (buat file "Procfile") > web: node <nama file index/app>
4. (edit package.json) > scripts > "start": "node <nama file index/app>"
5. heroku addons:add heroku-postgresql
6. (tambah config production) v
"production": {
  "use_env_variable":"DATABASE_URL",
  "ssl": true,
  "dialect": "postgres",
  "protocol": "postgres",
  "dialectOptions": {
    "ssl": {
      "require": true,
      "rejectUnauthorized": false
    }
  }
}
7. (ganti app/index) > const port = process.env.PORT || 3000
8. git add .
9. git commit -m 'pesan commit'
10. git push origin main/master
11. git push heroku main/master
11a. (cek error) > heroku logs --tail
11b. (buka heroku di browser) > heroku open
12. (buka terminal heroku) > heroku run bash
12. npm install -g sequelize-cli
13. sequelize db:migrate
14. sequelize-cli db:seed:all