const serviceAvailable = (name, status) => {
  let info = ``
  if (status) {
    info = `available`
  } else {
    info = `unavailable`
  }
  return `${name} is currently ${info}`
}


module.exports = serviceAvailable