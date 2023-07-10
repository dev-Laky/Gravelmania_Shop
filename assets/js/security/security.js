
// replace html syntax in strings
export function escape() {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function (tag) {
        return tagsToReplace[tag] || tag;
    });
};