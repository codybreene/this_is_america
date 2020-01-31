export const trumpTweets = {
  terms: ["trump", "Trump"],
  tweets: []
}
export const sandersTweets = {
  terms: ["Bernie Sanders", "bernie sanders"],
  tweets: []
}
export const bidenTweets = {
  terms: ["warren", "Warren"],
  tweets: []
}
export const warrenTweets = {
  terms: ["Biden", "biden"],
  tweets: []
}

const checkTruncated = (tweet, term) => {
  if(tweet.truncated) {
    if(tweet.extended_tweet.full_text.include(term)) return true
  }
  return false
}

const checkQuote = (tweet, term) => {
  if(tweet.is_quote_status) {
    if (checkTruncated(tweet.quoted_status, term)) {
      return true
    } else {
      if (checkText(tweet.quoted_status.text, term))
      return true
    }
    return false
  }
  return false
}

const checkText = (tweet, term) => {
  if(tweet.text.include(term)) return true
  return false
}

export const filterTweet = (tweet, terms) => {
  const valid = false
  terms.forEach(term => {
    if(checkTruncated(tweet, term) || checkText(tweet, term) || checkQuote(tweet, term)) {
      valid = true
    }
  })
  return valid
}

