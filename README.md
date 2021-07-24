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

```
$ npm install commander debug
```

```
$ ls
LICENSE			bin			package-lock.json
README.md		node_modules		package.json
$
$ npm ls
hello@1.0.0 /Users/kaz_hashimoto/github/hello
├── commander@8.0.0
└── debug@4.3.2

$
```
