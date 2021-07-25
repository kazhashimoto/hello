# hello

## Repositoryの作成とclone
（省略）

## cloneしたディレクトリで作業
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

.gitignoreにnode_modules/を追加
```
$ touch .gitignore
```

以下の行を追加
```
node_modules/
```

hello.jsがrequireしているパッケージをローカルにinstall
```
$ npm install commander debug
```

プロジェクトのディレクトリにnode_modulesが作られる。
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

package.jsonとpackage-lock.binにdependenciesが追加されているのがわかる。
```
"dependencies": {
  "commander": "^8.0.0",
  "debug": "^4.3.2"
}
```

ここまでをRepositoryに一旦push

## npmパッケージの作成準備
