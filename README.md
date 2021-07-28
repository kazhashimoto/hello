# hello
helloはターミナルに"hello, world!"を表示する、Node.jsを使ったコマンドラインのJavaScriptプログラムです。
このRepositoryは、npmパッケージの作成からGitHub Packagesへ登録するまでの手順を理解するために作った練習用のリソースです。

**実行環境**
- Node.js v16.4.0
- エディタ: Atom v1.58
- macOS Big Sur 11.5

**目次**
- リポジトリの作成
- 最初のnpmパッケージを作る
- パッケージのinstallテスト
- eslintをworkflowに組み込む
- GitHub Packagesにnpmパッケージとして登録する
- GitHub Packagesへの登録をworkflowに組み込む

## 手順
### リポジトリの作成
TBD

### 最初のnpmパッケージを作る
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
hello@1.0.0 /Users/me/github/hello
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

### パッケージのinstallテスト
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
hello@1.0.0 /Users/me/github/test-package
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
/Users/me/.nodebrew/node/v16.4.0
$
$ ls -l bin/ lib/node_modules/ | grep hello
lrwxr-xr-x  1 me  staff   38  7 25 09:31 hello -> ../lib/node_modules/hello/bin/hello.js
lrwxr-xr-x  1 me  staff   34  7 25 09:31 hello -> ../../../../../github/test-package
$
```

globalにインストールされているのがわかる。
```
$ npm ls -g
/Users/me/.nodebrew/node/v16.4.0/lib
├── analyze-css@1.0.0
├── hello@1.0.0 -> ./../../../../github/test-package
└── npm@7.18.1

$
```

どこか他のディレクトリでhelloを実行してみる。
```
$ pwd
/Users/me
$ hello
/Users/me/.nodebrew/current/bin/hello: line 1: syntax error near unexpected token `('
/Users/me/.nodebrew/current/bin/hello: line 1: `const { program } = require("commander");'
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
/Users/me/.nodebrew/node/v16.4.0/lib
├── analyze-css@1.0.0
└── npm@7.18.1

$ cd $(npm prefix -g)
$ ls -l bin/ lib/node_modules/ | grep hello

```

### eslintをworkflowに組み込む

ローカルのhelloディレクトリを削除し、Repositoryからcloneし直す。
プロジェクトのディレクトリhelloにcdし、eslintをローカルにインストールする。
```
$ npm install eslint --save-dev
```

--initオプションを付けてeslintを実行し、いくつかの質問に答えていくと、最後に.eslintrc.jsファイルがプロジェクトのディレクトリ直下に生成される。
```
$ ./node_modules/.bin/eslint --init
✔ How would you like to use ESLint? · problems
✔ What type of modules does your project use? · commonjs
✔ Which framework does your project use? · none
✔ Does your project use TypeScript? · No / Yes
✔ Where does your code run? · node
✔ What format do you want your config file to be in? · JavaScript
Successfully created .eslintrc.js file in /Users/me/github/hello
$
$ $ npm ls
hello@1.0.0 /Users/me/github/hello
├── commander@8.0.0
├── debug@4.3.2
└── eslint@7.31.0

$
```

オプション--save-devでinstallしたので、package.jsonにdevDependenciesesが追加されeslintが記録される。
```
"devDependencies": {
  "eslint": "^7.31.0"
}
```

動作を確認。
```
 $ ./node_modules/.bin/eslint bin/hello.js
```

package.jsonのscript項目にlintの実行を追記する。元々ある"test"の行末に「,」を付け足すのを忘れずに。
```
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "lint": "eslint bin/*.js"
},
```

npmコマンドから実行できることを確認。
```
$ npm run lint
> hello@1.0.0 lint
> eslint bin/*.js
$
```
ここまでを一旦Repositoryにpushする。

### GitHubのworkflowにActionを追加

(Repository画面での操作)
Actionのテンプレートを元に、lint.ymlを作成してcommitする。
しばらくすると、Actionが実行される。結果の詳細を確認できる。

ここまでで一旦Repositoryからfetch＆pullしてローカルにも
.github/workflows/lint.ymlを持ってきておく。
今後、lint.ymlはGitHub画面上で編集＆commitするのが簡単。


### GitHub Packagesにnpmパッケージとして登録する
PATを生成しておく。
repoとwrite:packagesをONにしてUpdate token。
Generate new tokenをクリック。表示されたtokenをメモる。

```
$ cd hello
$ npm login --scope=@kazhashimoto --registry=https://npm.pkg.github.com

> Username: kazhashimoto
> Password: TOKEN
> Email: (email address)
```

~/.npmrcファイルが作られ、次の行が追加される。
```
//npm.pkg.github.com/:_authToken=TOKEN
```

package.jsonにpublishConfig項目を追加する。
```
"publishConfig": {
  "registry": "https://npm.pkg.github.com"
}
```

nameをscopeの形式にしておく。
```
"name": "@kazhashimoto/hello",
```

```
$ touch .npmignore
```
パッケージに含めないフォルダやファイル名を指定しておく。

```
node_modules/
.github/
```
ここまでをRepositoryに一旦push。

GitHub Packagesに登録
```
$ npm publish
```

しばらくすると、Repositoryのページ右側のPackages欄にhelloパッケージが表示される。

### GitHub Packagesからのインストールテスト

```
$ mkdir test-package
$ cd test-package/
$ npm init -y
$ touch .npmrc
```

.npmrcに以下の行を記述。
```
@kazhashimoto:registry=https://npm.pkg.github.com
```

globalにインストール
```
$ npm install -g @kazhashimoto/hello@1.0.0
```

```
$ npm ls -g
/Users/me/.nodebrew/node/v16.4.0/lib
├── @kazhashimoto/hello@1.0.0
├── analyze-css@1.0.0
└── npm@7.18.1

$
```

アンインストール
```
$ npm uninstall -g @kazhashimoto/hello
```

### GitHub Packagesへの登録をworkflowに組み込む
リリースが作成された時にパッケージをGitHub Packagesに登録するworkflowの作り方。

RepositoryのActionsタブ > New workflow > set up a workflow yourselfでエディタを開き、
[Publishing packages to GitHub Packages](https://docs.github.com/en/actions/guides/publishing-nodejs-packages#publishing-packages-to-github-packages)
のExample workflowのコードをコピペする。
`node-version`の値を対象バージョンに書き換え、`scope`の値を自分のGitHubアカウント名に書き換える。
```
node-version: 16

scope: '@kazhashimoto'
```
ファイル名をpublish.ymlなどにしてcommitする。
今後、新しいReleaseを作成する度にpublish.ymlのworkflowが実行されて、そのバージョンでのパッケージがGitHub Packagesに登録される。
新しいReleaseを作成する前に、package.jsonで`version`の値を上げてpushしておく必要がある。
