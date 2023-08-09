const keyboard = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

function checkKeyboardSequence(value) {
    for (let i = 0; i < value.length - 2; i++) {
        const pos1 = getPosition(value[i])
        const pos2 = getPosition(value[i + 1])
        const pos3 = getPosition(value[i + 2])
        if (pos1 && pos2 && pos3 && isConsecutive(pos1, pos2, pos3)) {
            return false
        }
    }
    return true
}

function getPosition(character) {
    for (let i = 0; i < keyboard.length; i++) {
        const j = keyboard[i].indexOf(character)
        if (j > -1) {
            return [i, j]
        }
    }
    return null
}

function isConsecutive(pos1, pos2, pos3) {
    return isSameLineAndDirection(pos1, pos2, pos3) && isNextTo(pos1, pos2) && isNextTo(pos2, pos3)
}

function isNextTo(first, second) {
    return Math.abs(first[0] - second[0]) <= 1 && Math.abs(first[1] - second[1]) <= 1
}

function isSameLineAndDirection(pos1, pos2, pos3) {
    const rowChange1 = pos2[0] - pos1[0]
    const colChange1 = pos2[1] - pos1[1]
    const rowChange2 = pos3[0] - pos2[0]
    const colChange2 = pos3[1] - pos2[1]
    return pos1[0] !== 0 && rowChange1 === rowChange2 && colChange1 === colChange2
}

const rules = {
    noSpecialChars: (value) =>
        /^[\u4E00-\u9FA5a-zA-Z0-9_\-\s\u3040-\u30FF\u3100-\u312F]+$/.test(value) || '只能有以下符號:-_\'',
    required: (value) => !!value || '必填',
    greaterThanZero: (value) => /^[1-9]\d*$/.test(value) || '請輸入整數',
    lengthLimit: (value) => ((value || '').length >= 2 && (value || '').length <= 20) || '必須介於2至20個字符之間',
    keyboardSequence: (value) => checkKeyboardSequence(value) || '請勿依照鍵盤順序',
    isExist: (list) => (value) => !list.includes(value) || `${value} 已存在`,
    atLeastOne: (...values) => (values.some(value => value.length > 0)) || '同項目至少一個必填',
    emailRules: (value) => /.+@.+\..+/.test(value) || '須有效E-mail，檢查中複製以下通過 1@1.com  ',
    atLeastLength: (number) => (value) => ((value || '').length >= number) || `至少${number}個字 複製 1111111111111111`
}

export { rules };
