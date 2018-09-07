# Fabbys News Network Blog

First of all - many thanks to [@stefan0uh](https://github.com/stefan0uh) and [@playgroundplaying](https://github.com/playgroundplaying)


## Twitter - API
The `oAuth` from twitter is read by the environment.

```
TWCO_KEY={consumer_key}
TWCO_SECRET={consumer_secret}
ACTO_KEY={access_token_key}
ACTO_SECRET={access_token_secret}
```

https://developer.twitter.com/en/docs/basics/authentication/api-reference/request_token.html



## Roadmap:

----------

### Prio 1
- [ ] add Helmet

#### Post
- [x] show
- [x] delete
- [x] add
- [ ] from User
- [ ] create date
- [ ] testing

#### Comment   
- [x] show
- [x] delete
- [x] add
- [ ] from User
- [ ] create date
- [ ] testing

#### Usermanagment
- [x] Login
- [-] Password Handling
- [-] Security & Access & Permissions
- [x] Userprofil

#### Admin Env
- [ ] Security & Handling
- [ ] Acccess to configs
- tbh

#### Env-Configs
- [ ] Outsource all configs

#### Cleaning
- [ ] Clean up code
- [x] define router, controllers, helpers, middlewares, models / if needed in separate folders to got more structure

----------

### Prio2:
- [ ] Image Posting
- [ ] Gallery
- [ ] Styling
    - [ ] Config driven styling
    - [ ] Auto-size all textareas
- tbh

### Notes:

- after modal.js is now implimented in the .ejs it´s now in the views/blog folder not longer under public/libs
