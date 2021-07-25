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
テスト用のディレクトリを作り、そこにRepositoryからhelloのプロジェクト一式をcloneする。
```
$ mkdir test-package
```

このままではrequireしたpackageがまだローカルにインストールされていないので、npm installして./node_modulesにダウンロードさせる。
```
$ cd test-package/
$ npm install
```

```
$ ls
LICENSE			bin			package-lock.json
README.md		node_modules		package.json
$
$ npm ls
hello@1.0.0 /Users/kaz_hashimoto/github/test-package
├── commander@8.0.0
└── debug@4.3.2

$
```

hello packageをglobalに見かけ上インストールするため、npm linkを実行してtest-packageへのシンボリックリンクを作成する。
```
$ npm link
added 1 package, and audited 3 packages in 864ms

found 0 vulnerabilities
$
```
nodeの{prefix}/binと{prefix}/libにシンボリックリンクが作られているのがわかる。
```
$ cd $(npm prefix -g)
$ pwd
/Users/kaz_hashimoto/.nodebrew/node/v16.4.0
$
$ ls -l bin/ lib/node_modules/ | grep hello
lrwxr-xr-x  1 kaz_hashimoto  staff        38  7 25 09:31 hello -> ../lib/node_modules/hello/bin/hello.js
lrwxr-xr-x   1 kaz_hashimoto  staff   34  7 25 09:31 hello -> ../../../../../github/test-package
$
```

globalにインストールされているのがわかる。
```
$ npm ls -g
/Users/kaz_hashimoto/.nodebrew/node/v16.4.0/lib
├── analyze-css@1.0.0
├── hello@1.0.0 -> ./../../../../github/test-package
└── npm@7.18.1

$
```

どこか他のディレクトリでhelloを実行してみる。
```
$ pwd
/Users/kaz_hashimoto
$ hello
/Users/kaz_hashimoto/.nodebrew/current/bin/hello: line 1: syntax error near unexpected token `('
/Users/kaz_hashimoto/.nodebrew/current/bin/hello: line 1: `const { program } = require("commander");'
$
```

hello.jsの１行目に以下を追加
```
#!/usr/bin/env node
```

```
$ hello
hello, world!
$
$ hello -u
HELLO, WORLD!
$
```

hello.jsを修正したのでRepositoryにpushしておく。

uninstall -gでシンボリックリンクを削除する。

```
$ npm uninstall -g hello
removed 1 package, and audited 1 package in 229ms
```
globalから削除され、シンボリックリンクも消えたのを確認。

```
$ npm ls -g
/Users/kaz_hashimoto/.nodebrew/node/v16.4.0/lib
├── analyze-css@1.0.0
└── npm@7.18.1

$ cd $(npm prefix -g)
$ ls -l bin/ lib/node_modules/ | grep hello

```

## eslintのインストール

ローカルのhelloディレクトリを削除し、Repositoryからcloneし直す。
プロジェクトのディレクトリhelloにcdし、eslintをローカルにインストールする。
```
$ npm install eslint --save-dev
$ ./node_modules/.bin/eslint --init
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ What format do you want your config file to be in? · JavaScript
Successfully created .eslintrc.js file in /Users/kaz_hashimoto/github/hello
$ 
```
