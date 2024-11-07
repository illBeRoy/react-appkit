export type Key =
  | ModifierKeys
  | NumberKeys
  | LetterKeys
  | FnKeys
  | SpecialKeys
  | MediaKeys
  | ArrowKeys;

export type ModifierKeys =
  | 'Cmd'
  | 'Ctrl'
  | 'CmdOrCtrl'
  | 'Alt'
  | 'Shift'
  | 'Meta';

export type NumberKeys =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type LetterKeys =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export type FnKeys =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12';

export type SpecialKeys =
  | 'Enter'
  | 'Space'
  | 'Backspace'
  | 'Escape'
  | 'Delete'
  | 'Tab'
  | 'CapsLock'
  | 'NumLock'
  | 'ScrollLock'
  | 'Insert';

export type MediaKeys =
  | 'MediaPlayPause'
  | 'MediaNextTrack'
  | 'MediaPrevTrack'
  | 'MediaStop';

export type ArrowKeys = 'Up' | 'Down' | 'Left' | 'Right';
