const port = 3000

function urlShortener() {
  const url = "http://www.google.com.tw"
  const splitUrl = url.split('//')
  function randomWords() {
    let word = []
    function randomWord() {
      const letters
        = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const letterSplited = letters.split('')
      const randomNumber = Math.floor(Math.random() * 62)
      return letterSplited[randomNumber]
    }
    for (i = 0; i < 5; i++) {
      let newWord = randomWord()
      word = word + newWord
    }
    return word
  }

  return splitUrl[0] + '//localhost:' + `${port}/` + randomWords()
}

module.exports = urlShortener