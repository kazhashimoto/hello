# hello
helloはターミナルに"hello, world!"を表示する、Node.jsを使ったコマンドラインのJavaScriptプログラムです。
このRepositoryは、npmパッケージの作成からGitHub Packagesへ登録するまでの手順を試すための練習用のリソースです。
詳細は、https://qiita.com/kazhashimoto/items/aedd7d6dae1aca80a814

## Installation

```
$ mkdir test-package
$ cd test-package
$ npm init -y
$ echo "@kazhashimoto:registry=https://npm.pkg.github.com" > .npmrc
$ npm install @kazhashimoto/hello@1.0.x -g
```

How to uninstall this package:
```
$ npm uninstall @kazhashimoto/hello -g
```

## Usage

```
$ hello --help
Usage: hello [options]

Options:
  -V, --version  output the version number
  -u, --upper    convert the message to upper case
  -h, --help     display help for command
```

```
$ hello
hello, world!
$ hello -u
HELLO, WORLD!
```

### Turning on debug mode

```
$ DEBUG=* hello -u
```
