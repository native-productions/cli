# @nvptech/image-gen

Image sizes generator for your static images

## How to use

You can use `npx` to execute this lib, input path is the image that you want to generate, output path is your path that should be able to write generated images

```shell
npx @nvptech/image-gen gen <input> <output>
```

## Generate images

```shell
npx @nvptech/image-gen gen ./path/to/your/image.png .path/to/your/output
```

## Get help

```shell
npx @nvptech/image-gen --help
```

## Custom folder name

```shell
npx @nvptech/image-gen -f gens ./path/to/your/image.png .path/to/your/output
```

## Using config

you can use both `js` or `json` by declaring the config
if you're using `js` you need to exports the config using `module.exports`

```shell
npx @nvptech/image-gen -c ./path/to/config.[js|json]
```

## Using config example

`./gen.config.js`

```javascript
module.exports = {
  input: './examples/js/img-gen/input/logo.png', // required
  output: './examples/js/img-gen/output', // required
  folderName: 'ayo-logos', // optional
  sizes: [
    {
      width: 72,
      height: 72,
      name: 'android-chrome',
      ext: '.png',
    }
  ] // required | at least one array
}
```

then

```shell
npx @nvptech/image-ge -c ./gen.config.js
```
