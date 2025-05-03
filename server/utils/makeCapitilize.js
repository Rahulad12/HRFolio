const makeCapitilized = (text) => {

    if (!text) return '';
    const hasSpace = text.includes(' ');
    if (!hasSpace) return text.charAt(0).toUpperCase() + text.slice(1)

    const firsthalf = text.split(' ')[0].charAt(0).toUpperCase() + text.split(' ')[0].slice(1)
    const secondhalf = text.split(' ')[1].charAt(0).toUpperCase() + text.split(' ')[1].slice(1)
    const res = firsthalf + ' ' + secondhalf
    return res;
};



export { makeCapitilized };