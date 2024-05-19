/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
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

export interface LayoutEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  darkMode: boolean;
  setLoading: (lding: boolean) => void;
  inContext: boolean;
  restoredOk: boolean;
  handleSetRestoredOk: (status: boolean) => void;
  flashedID: string;
}

export interface KeyType {
  keyCode: number;
  label: string | JSX.Element;
  extraLabel?: string;
  verbose?: string;
}

export interface SegmentedKeyType {
  base: number;
  modified: number;
}

export interface KeymapType {
  custom: KeyType[][];
  default: KeyType[][];
  onlyCustom: boolean;
}

export interface PaletteType {
  r: number;
  g: number;
  b: number;
  rgb: string;
}

export interface ColormapType {
  palette: PaletteType[];
  colorMap: number[][];
}
