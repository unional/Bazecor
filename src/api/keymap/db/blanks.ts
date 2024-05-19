/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { KeymapCodeTableType, NOKEY_KEY_CODE, TRANS_KEY_CODE } from "../types";

const TRANS_KEY: KeymapCodeTableType = {
  // Transparent
  code: TRANS_KEY_CODE,
  labels: {
    top: "TRANS",
    primary: "",
    verbose: "Transparent",
  },
};

const NOKEY_KEY: KeymapCodeTableType = {
  // NoKey
  code: NOKEY_KEY_CODE,
  labels: {
    top: "NO",
    primary: "KEY",
    verbose: "Disabled",
  },
};

const BlankTable = {
  groupName: "Blank",
  keys: [NOKEY_KEY, TRANS_KEY],
};

export default BlankTable;
