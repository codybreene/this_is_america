export const buttigieg = {
  query: "pete buttigieg",
  tweets: []
}

export const sanders = {
  query: "bernie sanders",
  tweets: []
}

export const warren = {
  query: "elizabeth warren",
  tweets: []
}

export const biden = {
  query: "joe biden",
  tweets: []
}

export const bloomberg = {
  query: "mike bloomberg",
  tweets: []
}

export const klobuchar = {
  query: "amy klobuchar",
  tweets: []
}

const checkTruncated = (tweet, term) => {
  if(tweet.truncated) {
    if(tweet.extended_tweet.full_text.includes(term)) return true
  }
  return false
}

const checkQuote = (tweet, term) => {
  if(tweet.is_quote_status) {
    if (checkTruncated(tweet.quoted_status, term)) {
      return true
    } else {
      if (checkText(tweet.quoted_status, term))
      return true
    }
    return false
  }
  return false
}

const checkText = (tweet, term) => {
  if(tweet.text.includes(term)) return true
  return false
}

export const filterTweet = (tweet, terms) => {
  let valid = false
  terms.forEach(term => {
    if(checkTruncated(tweet, term) || checkText(tweet, term) || checkQuote(tweet, term)) {
      valid = true
    }
  })
  return valid
}

