
export function slugCreator (str: string) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  var from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;'
  var to = 'aaaaaeeeeeiiiiooooouuuunc------'
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid characters
    .replace(/\s+/g, '-') // remove blanks and replace them with -
    .replace(/-+/g, '-') // remove double strokes

  return str
}
