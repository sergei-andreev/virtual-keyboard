export default class Textarea {
  constructor($textarea) {
    this.$textarea = $textarea;
  }

  addCharacter(key) {
    const start = this.$textarea.selectionStart;
    const end = this.$textarea.selectionEnd;
    this.$textarea.value = this.$textarea.value.slice(0, start)
        + key + this.$textarea.value.slice(end);
    this.$textarea.selectionEnd = start + 1;
  }

  removeCharacters() {
    const start = this.$textarea.selectionStart;
    const end = this.$textarea.selectionEnd;

    if (start === 0 && end === 0) {
      return;
    }

    if (start === 0 && end === this.$textarea.value.length) {
      this.$textarea.value = '';
      return;
    }

    if (start === end) {
      this.$textarea.value = this.$textarea.value.slice(0, start - 1)
          + this.$textarea.value.slice(end);
      this.$textarea.selectionEnd = start - 1;
      return;
    }

    this.$textarea.value = this.$textarea.value.slice(0, start)
        + this.$textarea.value.slice(end);
    this.$textarea.selectionEnd = start;
  }

  removeNextCharacters() {
    const start = this.$textarea.selectionStart;
    const end = this.$textarea.selectionEnd;

    if (start === 0 && end === this.$textarea.value.length) {
      this.$textarea.value = '';
      return;
    }

    if (start === end) {
      this.$textarea.value = this.$textarea.value.slice(0, start)
          + this.$textarea.value.slice(end + 1);
      this.$textarea.selectionEnd = start;
      return;
    }

    this.$textarea.value = this.$textarea.value.slice(0, start)
        + this.$textarea.value.slice(end);
    this.$textarea.selectionEnd = start;
  }

  doSpecialKey(key) {
    switch (key.code) {
      case 'Backspace':
        this.removeCharacters();
        break;
      case 'Tab':
        this.addCharacter('    ');
        break;
      case 'Enter':
        this.addCharacter('\n');
        break;
      case 'Space':
        this.addCharacter(' ');
        break;
      case 'Delete':
        this.removeNextCharacters();
        break;
      default:
        break;
    }
  }
}
