# hello

```
$ cd hello
$ npm init -y
```

package.jsonを編集　（binとlicense)
```
"bin": {
  "hello": "bin/hello.js"
},
```

```
$ touch .gitignore
```

.gitignoreにnode_modules/を追加
```
node_modules/
```
